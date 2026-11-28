using SplitPay.API.DTOs;
using SplitPay.API.Models;
using SplitPay.API.Repositories;

namespace SplitPay.API.Services;

public class GastoService : IGastoService
{
    private readonly IGastoRepository _repo;

    public GastoService(IGastoRepository repo)
    {
        _repo = repo;
    }

    public async Task<GrupoResumenDto> ObtenerResumenGrupoAsync(int grupoId, int usuarioId)
    {
        var grupo = await _repo.ObtenerGrupoConMiembrosAsync(grupoId)
            ?? throw new KeyNotFoundException("Grupo no encontrado.");

        var miembros = await _repo.ObtenerMiembrosGrupoAsync(grupoId);
        var cuotasGrupo = await _repo.ObtenerCuotasPorGrupoAsync(grupoId);

        var deudaIndividual = cuotasGrupo
            .Where(c => c.UsuarioId == usuarioId && c.EstadoPago != "Pagado")
            .Sum(c => c.MontoAsignado);

        var totalPorRecaudar = cuotasGrupo
            .Where(c => c.EstadoPago != "Pagado")
            .Sum(c => c.MontoAsignado);

        var totalRecaudado = cuotasGrupo
            .Where(c => c.EstadoPago == "Pagado")
            .Sum(c => c.MontoAsignado);

        return new GrupoResumenDto
        {
            GrupoId = grupo.GrupoId,
            NombreGrupo = grupo.NombreGrupo,
            CodigoInvitacion = grupo.CodigoInvitacion,
            DeudaPendienteIndividual = deudaIndividual,
            TotalPorRecaudarGrupo = totalPorRecaudar,
            TotalRecaudadoGrupo = totalRecaudado,
            TotalMiembros = miembros.Count,
            Miembros = miembros.Select(m => new MiembroGrupoDto
            {
                UsuarioId = m.UsuarioId,
                NombreCompleto = m.NombreCompleto,
                Email = m.Email,
                Rol = m.Rol
            }).ToList()
        };
    }

    public async Task<GastoResponseDto> CrearGastoConProrrateoAsync(int grupoId, int creadoPorId, CreateGastoDto dto)
    {
        var miembros = await _repo.ObtenerMiembrosGrupoAsync(grupoId);
        if (miembros.Count == 0)
            throw new InvalidOperationException("El grupo no tiene miembros activos para prorratear el gasto.");

        // Cálculo equitativo con precisión de 2 decimales y ajuste de redondeo en el primer integrante
        decimal cuotaBase = Math.Floor((dto.MontoTotal / miembros.Count) * 100) / 100;
        decimal residuo = dto.MontoTotal - (cuotaBase * miembros.Count);

        var nuevoGasto = new GastoComun
        {
            GrupoId = grupoId,
            CreadoPorId = creadoPorId,
            Concepto = dto.Concepto.Trim(),
            Descripcion = dto.Descripcion?.Trim(),
            MontoTotal = dto.MontoTotal,
            FechaGasto = DateTime.Now
        };

        var cuotas = new List<CuotaIndividual>();
        for (int i = 0; i < miembros.Count; i++)
        {
            decimal montoMiembro = (i == 0) ? cuotaBase + residuo : cuotaBase;
            cuotas.Add(new CuotaIndividual
            {
                UsuarioId = miembros[i].UsuarioId,
                MontoAsignado = montoMiembro,
                EstadoPago = "Pendiente"
            });
        }

        var gastoGuardado = await _repo.CrearGastoConCuotasTransaccionalAsync(nuevoGasto, cuotas);
        return (await ObtenerDetalleGastoAsync(gastoGuardado.GastoId, grupoId))!;
    }

    public async Task<List<GastoResponseDto>> ListarGastosGrupoAsync(int grupoId, string? filtroEstado = null)
    {
        var gastos = await _repo.ObtenerGastosPorGrupoAsync(grupoId);
        var miembros = await _repo.ObtenerMiembrosGrupoAsync(grupoId);
        var cuotas = await _repo.ObtenerCuotasPorGrupoAsync(grupoId);

        var resultado = new List<GastoResponseDto>();

        foreach (var g in gastos)
        {
            var cuotasGasto = cuotas.Where(c => c.GastoId == g.GastoId).ToList();
            var creador = miembros.FirstOrDefault(m => m.UsuarioId == g.CreadoPorId)?.NombreCompleto ?? "Admin";

            var dto = new GastoResponseDto
            {
                GastoId = g.GastoId,
                Concepto = g.Concepto,
                Descripcion = g.Descripcion,
                MontoTotal = g.MontoTotal,
                FechaGasto = g.FechaGasto,
                CreadoPor = creador,
                TotalCuotas = cuotasGasto.Count,
                CuotasPagadas = cuotasGasto.Count(c => c.EstadoPago == "Pagado"),
                Cuotas = cuotasGasto.Select(c => new CuotaDetalleDto
                {
                    CuotaId = c.CuotaId,
                    UsuarioId = c.UsuarioId,
                    NombreUsuario = miembros.FirstOrDefault(m => m.UsuarioId == c.UsuarioId)?.NombreCompleto ?? "Usuario",
                    MontoAsignado = c.MontoAsignado,
                    EstadoPago = c.EstadoPago
                }).ToList()
            };

            if (!string.IsNullOrWhiteSpace(filtroEstado) &&
                filtroEstado.Equals("Pendientes", StringComparison.OrdinalIgnoreCase))
            {
                if (dto.CuotasPagadas < dto.TotalCuotas)
                    resultado.Add(dto);
            }
            else
            {
                resultado.Add(dto);
            }
        }

        return resultado;
    }

    public async Task<GastoResponseDto?> ObtenerDetalleGastoAsync(int gastoId, int grupoId)
    {
        var gasto = await _repo.ObtenerGastoDetalleAsync(gastoId, grupoId);
        if (gasto == null) return null;

        var lista = await ListarGastosGrupoAsync(grupoId);
        return lista.FirstOrDefault(x => x.GastoId == gastoId);
    }

    public async Task<bool> ActualizarGastoAsync(int gastoId, int grupoId, UpdateGastoDto dto)
    {
        var gasto = await _repo.ObtenerGastoDetalleAsync(gastoId, grupoId);
        if (gasto == null) return false;

        gasto.Concepto = dto.Concepto.Trim();
        gasto.Descripcion = dto.Descripcion?.Trim();

        return await _repo.ActualizarGastoAsync(gasto);
    }

    public async Task<(bool Exito, string Mensaje)> EliminarGastoAsync(int gastoId, int grupoId)
    {
        var gasto = await _repo.ObtenerGastoDetalleAsync(gastoId, grupoId);
        if (gasto == null)
            return (false, "Gasto no encontrado.");

        if (await _repo.TieneCuotasPagadasAsync(gastoId))
            return (false, "No se puede eliminar un gasto que ya cuenta con cuotas aprobadas.");

        await _repo.EliminarGastoAsync(gasto);
        return (true, "Gasto eliminado correctamente.");
    }
}
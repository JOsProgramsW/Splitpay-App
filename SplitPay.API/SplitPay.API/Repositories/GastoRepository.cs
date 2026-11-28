using Microsoft.EntityFrameworkCore;
using SplitPay.API.Data;
using SplitPay.API.Models;

namespace SplitPay.API.Repositories;

public class GastoRepository : IGastoRepository
{
    private readonly AppDbContext _context;

    public GastoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Grupo?> ObtenerGrupoConMiembrosAsync(int grupoId)
    {
        return await _context.Grupos
            .FirstOrDefaultAsync(g => g.GrupoId == grupoId);
    }

    public async Task<List<Usuario>> ObtenerMiembrosGrupoAsync(int grupoId)
    {
        return await _context.Usuarios
            .Where(u => u.GrupoId == grupoId)
            .OrderBy(u => u.UsuarioId)
            .ToListAsync();
    }

    public async Task<GastoComun> CrearGastoConCuotasTransaccionalAsync(GastoComun gasto, List<CuotaIndividual> cuotas)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.GastosComunes.Add(gasto);
            await _context.SaveChangesAsync();

            foreach (var cuota in cuotas)
            {
                cuota.GastoId = gasto.GastoId;
            }

            _context.CuotasIndividuales.AddRange(cuotas);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return gasto;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<GastoComun>> ObtenerGastosPorGrupoAsync(int grupoId)
    {
        return await _context.GastosComunes
            .Where(g => g.GrupoId == grupoId)
            .OrderByDescending(g => g.FechaGasto)
            .ToListAsync();
    }

    public async Task<GastoComun?> ObtenerGastoDetalleAsync(int gastoId, int grupoId)
    {
        return await _context.GastosComunes
            .FirstOrDefaultAsync(g => g.GastoId == gastoId && g.GrupoId == grupoId);
    }

    public async Task<bool> ActualizarGastoAsync(GastoComun gasto)
    {
        _context.GastosComunes.Update(gasto);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> TieneCuotasPagadasAsync(int gastoId)
    {
        return await _context.CuotasIndividuales
            .AnyAsync(c => c.GastoId == gastoId && c.EstadoPago == "Pagado");
    }

    public async Task<bool> EliminarGastoAsync(GastoComun gasto)
    {
        _context.GastosComunes.Remove(gasto);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<CuotaIndividual>> ObtenerCuotasPorGrupoAsync(int grupoId)
    {
        var gastoIds = await _context.GastosComunes
            .Where(g => g.GrupoId == grupoId)
            .Select(g => g.GastoId)
            .ToListAsync();

        return await _context.CuotasIndividuales
            .Where(c => gastoIds.Contains(c.GastoId))
            .ToListAsync();
    }
}
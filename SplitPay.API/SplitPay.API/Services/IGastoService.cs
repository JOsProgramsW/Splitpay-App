using SplitPay.API.DTOs;

namespace SplitPay.API.Services;

public interface IGastoService
{
    Task<GrupoResumenDto> ObtenerResumenGrupoAsync(int grupoId, int usuarioId);
    Task<GastoResponseDto> CrearGastoConProrrateoAsync(int grupoId, int creadoPorId, CreateGastoDto dto);
    Task<List<GastoResponseDto>> ListarGastosGrupoAsync(int grupoId, string? filtroEstado = null);
    Task<GastoResponseDto?> ObtenerDetalleGastoAsync(int gastoId, int grupoId);
    Task<bool> ActualizarGastoAsync(int gastoId, int grupoId, UpdateGastoDto dto);
    Task<(bool Exito, string Mensaje)> EliminarGastoAsync(int gastoId, int grupoId);
}
using SplitPay.API.Models;

namespace SplitPay.API.Repositories;

public interface IGastoRepository
{
    Task<Grupo?> ObtenerGrupoConMiembrosAsync(int grupoId);
    Task<List<Usuario>> ObtenerMiembrosGrupoAsync(int grupoId);
    Task<GastoComun> CrearGastoConCuotasTransaccionalAsync(GastoComun gasto, List<CuotaIndividual> cuotas);
    Task<List<GastoComun>> ObtenerGastosPorGrupoAsync(int grupoId);
    Task<GastoComun?> ObtenerGastoDetalleAsync(int gastoId, int grupoId);
    Task<bool> ActualizarGastoAsync(GastoComun gasto);
    Task<bool> TieneCuotasPagadasAsync(int gastoId);
    Task<bool> EliminarGastoAsync(GastoComun gasto);
    Task<List<CuotaIndividual>> ObtenerCuotasPorGrupoAsync(int grupoId);
}
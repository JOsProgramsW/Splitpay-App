using System.ComponentModel.DataAnnotations;

namespace SplitPay.API.DTOs;

public class CreateGastoDto
{
    [Required(ErrorMessage = "El concepto es obligatorio.")]
    [MaxLength(100)]
    public string Concepto { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Descripcion { get; set; }

    [Required]
    [Range(0.01, 9999999.99, ErrorMessage = "El monto total debe ser mayor a 0.")]
    public decimal MontoTotal { get; set; }
}

public class UpdateGastoDto
{
    [Required(ErrorMessage = "El concepto es obligatorio.")]
    [MaxLength(100)]
    public string Concepto { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Descripcion { get; set; }
}

public class CuotaDetalleDto
{
    public int CuotaId { get; set; }
    public int UsuarioId { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public decimal MontoAsignado { get; set; }
    public string EstadoPago { get; set; } = string.Empty;
}

public class GastoResponseDto
{
    public int GastoId { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal MontoTotal { get; set; }
    public DateTime FechaGasto { get; set; }
    public string CreadoPor { get; set; } = string.Empty;
    public int TotalCuotas { get; set; }
    public int CuotasPagadas { get; set; }
    public List<CuotaDetalleDto> Cuotas { get; set; } = new();
}

public class MiembroGrupoDto
{
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}

public class GrupoResumenDto
{
    public int GrupoId { get; set; }
    public string NombreGrupo { get; set; } = string.Empty;
    public string CodigoInvitacion { get; set; } = string.Empty;
    public decimal DeudaPendienteIndividual { get; set; }
    public decimal TotalPorRecaudarGrupo { get; set; }
    public decimal TotalRecaudadoGrupo { get; set; }
    public int TotalMiembros { get; set; }
    public List<MiembroGrupoDto> Miembros { get; set; } = new();
}
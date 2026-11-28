using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SplitPay.API.Models;

public class Grupo
{
    [Key] public int GrupoId { get; set; }
    [Required, MaxLength(100)] public string NombreGrupo { get; set; } = string.Empty;
    [Required, MaxLength(10)] public string CodigoInvitacion { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}

public class Usuario
{
    [Key] public int UsuarioId { get; set; }
    public int GrupoId { get; set; }
    [ForeignKey("GrupoId")] public Grupo? Grupo { get; set; }
    [Required, MaxLength(120)] public string NombreCompleto { get; set; } = string.Empty;
    [Required, MaxLength(150)] public string Email { get; set; } = string.Empty;
    [Required] public string PasswordHash { get; set; } = string.Empty;
    [Required, MaxLength(20)] public string Rol { get; set; } = "Miembro"; // "Admin" o "Miembro"
}

[Table("GastosComunes")]
public class GastoComun
{
    [Key]
    public int GastoId { get; set; }
    public int GrupoId { get; set; }
    public int CreadoPorId { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public string? Descripcion { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal MontoTotal { get; set; }
    public DateTime FechaGasto { get; set; } = DateTime.Now;
}

[Table("CuotasIndividuales")]
public class CuotaIndividual
{
    [Key]
    public int CuotaId { get; set; }
    public int GastoId { get; set; }
    public int UsuarioId { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal MontoAsignado { get; set; }
    public string EstadoPago { get; set; } = "Pendiente";
}
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
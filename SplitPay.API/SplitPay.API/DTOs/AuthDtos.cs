using System.ComponentModel.DataAnnotations;

namespace SplitPay.API.DTOs;

public class RegisterRequestDto
{
    [Required] public string NombreCompleto { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
    [Required] public string TipoRegistro { get; set; } = "CrearGrupo"; // "CrearGrupo" o "UnirseGrupo"
    public string? NombreGrupo { get; set; } // Obligatorio si TipoRegistro == "CrearGrupo"
    public string? CodigoInvitacion { get; set; } // Obligatorio si TipoRegistro == "UnirseGrupo"
}

public class LoginRequestDto
{
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int UsuarioId { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public int GrupoId { get; set; }
    public string NombreGrupo { get; set; } = string.Empty;
    public string CodigoInvitacion { get; set; } = string.Empty;
}
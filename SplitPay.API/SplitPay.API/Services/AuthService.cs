using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SplitPay.API.Data;
using SplitPay.API.DTOs;
using SplitPay.API.Models;

namespace SplitPay.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            throw new Exception("El correo electrónico ya está registrado.");

        Grupo grupo;
        string rolAsignado;

        if (dto.TipoRegistro == "CrearGrupo")
        {
            if (string.IsNullOrWhiteSpace(dto.NombreGrupo))
                throw new Exception("Debe especificar el nombre del grupo.");

            grupo = new Grupo
            {
                NombreGrupo = dto.NombreGrupo.Trim(),
                CodigoInvitacion = Guid.NewGuid().ToString("N")[..6].ToUpper()
            };
            _context.Grupos.Add(grupo);
            await _context.SaveChangesAsync();
            rolAsignado = "Admin";
        }
        else
        {
            if (string.IsNullOrWhiteSpace(dto.CodigoInvitacion))
                throw new Exception("Debe ingresar un código de invitación.");

            grupo = await _context.Grupos.FirstOrDefaultAsync(g => g.CodigoInvitacion == dto.CodigoInvitacion.Trim().ToUpper())
                ?? throw new Exception("Código de invitación inválido.");
            rolAsignado = "Miembro";
        }

        var usuario = new Usuario
        {
            GrupoId = grupo.GrupoId,
            NombreCompleto = dto.NombreCompleto.Trim(),
            Email = dto.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Rol = rolAsignado
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return GenerarRespuestaConToken(usuario, grupo);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Grupo)
            .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
            throw new Exception("Credenciales incorrectas.");

        return GenerarRespuestaConToken(usuario, usuario.Grupo!);
    }

    private AuthResponseDto GenerarRespuestaConToken(Usuario usuario, Grupo grupo)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.UsuarioId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.Rol),
            new Claim("GrupoId", usuario.GrupoId.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            UsuarioId = usuario.UsuarioId,
            NombreCompleto = usuario.NombreCompleto,
            Email = usuario.Email,
            Rol = usuario.Rol,
            GrupoId = grupo.GrupoId,
            NombreGrupo = grupo.NombreGrupo,
            CodigoInvitacion = grupo.CodigoInvitacion
        };
    }
}
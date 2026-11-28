using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SplitPay.API.DTOs;
using SplitPay.API.Services;

namespace SplitPay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GastosController : ControllerBase
{
    private readonly IGastoService _gastoService;

    public GastosController(IGastoService gastoService)
    {
        _gastoService = gastoService;
    }

    [HttpGet]
    public async Task<IActionResult> ListarGastos([FromQuery] string? estado = null)
    {
        var grupoId = ObtenerGrupoIdDesdeToken();
        var gastos = await _gastoService.ListarGastosGrupoAsync(grupoId, estado);
        return Ok(gastos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerDetalle(int id)
    {
        var grupoId = ObtenerGrupoIdDesdeToken();
        var gasto = await _gastoService.ObtenerDetalleGastoAsync(id, grupoId);

        if (gasto == null)
            return NotFound(new { exito = false, mensaje = "Gasto no encontrado en tu grupo." });

        return Ok(gasto);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CrearGasto([FromBody] CreateGastoDto dto)
    {
        var usuarioId = ObtenerUsuarioIdDesdeToken();
        var grupoId = ObtenerGrupoIdDesdeToken();

        var creado = await _gastoService.CrearGastoConProrrateoAsync(grupoId, usuarioId, dto);
        return CreatedAtAction(nameof(ObtenerDetalle), new { id = creado.GastoId }, creado);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ActualizarGasto(int id, [FromBody] UpdateGastoDto dto)
    {
        var grupoId = ObtenerGrupoIdDesdeToken();
        var actualizado = await _gastoService.ActualizarGastoAsync(id, grupoId, dto);

        if (!actualizado)
            return NotFound(new { exito = false, mensaje = "Gasto no encontrado." });

        return Ok(new { exito = true, mensaje = "Gasto actualizado correctamente." });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> EliminarGasto(int id)
    {
        var grupoId = ObtenerGrupoIdDesdeToken();
        var (exito, mensaje) = await _gastoService.EliminarGastoAsync(id, grupoId);

        if (!exito)
            return BadRequest(new { exito = false, mensaje, codigoEstado = 400 });

        return Ok(new { exito = true, mensaje });
    }

    private int ObtenerUsuarioIdDesdeToken()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        return int.Parse(claim!.Value);
    }

    private int ObtenerGrupoIdDesdeToken()
    {
        var claim = User.FindFirst("GrupoId");
        return int.Parse(claim!.Value);
    }
}
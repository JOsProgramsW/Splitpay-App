using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SplitPay.API.Services;

namespace SplitPay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GruposController : ControllerBase
{
    private readonly IGastoService _gastoService;

    public GruposController(IGastoService gastoService)
    {
        _gastoService = gastoService;
    }

    [HttpGet("resumen")]
    public async Task<IActionResult> ObtenerResumen()
    {
        var usuarioId = ObtenerUsuarioIdDesdeToken();
        var grupoId = ObtenerGrupoIdDesdeToken();

        var resumen = await _gastoService.ObtenerResumenGrupoAsync(grupoId, usuarioId);
        return Ok(resumen);
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
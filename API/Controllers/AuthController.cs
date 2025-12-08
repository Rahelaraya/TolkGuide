using Application.Dtos;
using Infrastructure;          // hellre interfacet än Infrastructure
using Domain.Models;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]   // ⬅ VIKTIGT
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            var user = await _authService.RegisterAsync(request);
            if (user is null)
                return BadRequest("Username already exists.");

            return Ok(user);
        }

        [HttpPost("login")]
        [AllowAnonymous]   // ⬅ också öppen
        public async Task<ActionResult<TokenResponseDto>> Login(UserDto request)
        {
            var result = await _authService.LoginAsync(request);
            if (result is null)
                return BadRequest("Invalid username or password.");

            return Ok(result);
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]   // brukar också vara anonym
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await _authService.RefreshTokensAsync(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
                return Unauthorized("Invalid refresh token.");

            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated!");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are and admin!");
        }
    }
}


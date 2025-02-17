using Microsoft.AspNetCore.Mvc;
using DogGrooming.Models;
using DogGrooming.WebApi.Managers;
using DogGrooming.WebApi.Interfaces;

namespace DogGrooming.WebApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthManager _authManager;

        public AuthController(IAuthManager authManager)
        {
            _authManager = authManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest("Username and password are required.");
            }

            var result = await _authManager.RegisterUserAsync(user);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var result = await _authManager.LoginAsync(user);
            return Ok(result);
        }
    }
}

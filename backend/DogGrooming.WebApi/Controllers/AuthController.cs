using Microsoft.AspNetCore.Mvc;
using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using DogGrooming.WebApi.Managers;

namespace DogGrooming.WebApi.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly JwtManager _jwtManager;

        public AuthController(UserRepository userRepository, JwtManager jwtManager)
        {
            _userRepository = userRepository;
            _jwtManager = jwtManager;
        }

   
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return BadRequest("Username and password are required.");
            }

            var result = await _userRepository.RegisterUserAsync(user);
            return Ok(result);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return BadRequest("Username and password are required.");
            }

            var existingUser = await _userRepository.AuthenticateUserAsync(user.Username, user.PasswordHash);

            if (existingUser == null || existingUser.PasswordHash != user.PasswordHash)
                return Unauthorized("Invalid credentials.");

            var token = _jwtManager.GenerateJwtToken(existingUser);
            return Ok(new { token });
        }
    }
}

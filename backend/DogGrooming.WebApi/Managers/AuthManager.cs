using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace DogGrooming.WebApi.Managers
{
    public class AuthManager
    {
        private readonly UserRepository _userRepository;
        private readonly JwtManager _jwtManager;

        public AuthManager(UserRepository userRepository, JwtManager jwtManager)
        {
            _userRepository = userRepository;
            _jwtManager = jwtManager;
        }

        public async Task<UserRegistrationResult> RegisterUserAsync(User user)
        {
            try
            {
                Log.Information($"Attempting to register user: {user.Username}");

                // רישום משתמש
                var result = await _userRepository.RegisterUserAsync(user);
                if (result.Status == 1)
                {
                    Log.Information($"User {user.Username} registered successfully.");
                }
                else
                {
                    Log.Warning($"User {user.Username} registration failed: {result.Message}");
                }

                return result;
            }
            catch (Exception ex)
            {
                Log.Error($"Error registering user {user.Username}: {ex.Message}");
                return new UserRegistrationResult
                {
                    Status = -3,
                    UserId = null,
                    Message = "Unexpected error occurred."
                };
            }
        }

        public async Task<IActionResult> LoginAsync(User user)
        {
            try
            {
                Log.Information($"Attempting to authenticate user: {user.Username}");

                var existingUser = await _userRepository.AuthenticateUserAsync(user.Username, user.PasswordHash);

                if (existingUser == null || existingUser.PasswordHash != user.PasswordHash)
                {
                    Log.Warning($"Invalid credentials for user: {user.Username}");
                    return new UnauthorizedObjectResult("Invalid credentials.");
                }

                Log.Information($"User {user.Username} authenticated successfully.");

                var token = _jwtManager.GenerateJwtToken(existingUser);
                return new OkObjectResult(new { token });
            }
            catch (Exception ex)
            {
                Log.Error($"Error during login attempt for user {user.Username}: {ex.Message}");
                return new UnauthorizedObjectResult("Unexpected error occurred.");
            }
        }
    }
}

using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using DogGrooming.WebApi.Helpers;
using DogGrooming.Models.ApiResponse;
using DogGrooming.WebApi.Interfaces;
using DogGrooming.DAL.Interfaces;

namespace DogGrooming.WebApi.Managers
{
    public class AuthManager : IAuthManager
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtManager _jwtManager;
        private readonly IPasswordHasher _passwordHasher;

        public AuthManager(IUserRepository userRepository, IJwtManager jwtManager, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _jwtManager = jwtManager;
            _passwordHasher = passwordHasher; 
        }

        public async Task<UserRegistrationResult> RegisterUserAsync(User user)
        {
            UserRegistrationResult userRegistrationResult = new ();
            userRegistrationResult.successResponse = new();
            string message = string.Empty;
            try
            {
                string validationMessage = ValidateUserCredentials(user);
                if (!string.IsNullOrEmpty(validationMessage))
                {
                    userRegistrationResult.successResponse.Message = validationMessage;
                    return userRegistrationResult;
                }
                Log.Information($"Attempting to register user: {user.Username}");

            
                var (passwordHash, passwordSalt) = _passwordHasher.HashPassword(user.Password);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                var result = await _userRepository.RegisterUserAsync(user);
                if (result.Status == 1)
                {
                    message = $"User {user.Username} registered successfully.";
                    userRegistrationResult.successResponse.Success = true;
                }
                else
                {
                    message = $"User {user.Username} registration failed: {result.Message}";
                }

                Log.Information(message);
                userRegistrationResult.successResponse.Message = message;
            }
            catch (Exception ex)
            {
                Log.Error($"Error registering user {user.Username}: {ex.Message}");
                userRegistrationResult.successResponse.Message = ex.Message;
                userRegistrationResult.successResponse.Success = false;
            }
            return userRegistrationResult;
        }

        public async Task<LoginResponse> LoginAsync(User user)
        {
            LoginResponse loginResponse = new();
            loginResponse.successResponse = new();
            try
            {
                string validationMessage = ValidateUserCredentials(user);
                if (!string.IsNullOrEmpty(validationMessage))
                {
                    loginResponse.successResponse.Message = validationMessage;
                    return loginResponse;
                }
                Log.Information($"Attempting to authenticate user: {user.Username}");

                
                var existingUser = await _userRepository.AuthenticateUserAsync(user.Username);

                if (existingUser == null)
                {
                    Log.Warning($"User {user.Username} not found.");
                    loginResponse.successResponse.Message = "Invalid credentials.";
                    return loginResponse;
                }

                
                if (!_passwordHasher.VerifyPassword(user.Password, existingUser.PasswordHash, existingUser.PasswordSalt))
                {
                    Log.Warning($"Invalid password for user: {user.Username}");
                    loginResponse.successResponse.Message = "Invalid credentials.";
                    return loginResponse;
                }

                Log.Information($"User {user.Username} authenticated successfully.");

                var token = _jwtManager.GenerateJwtToken(existingUser);
                loginResponse.token = token;
                loginResponse.successResponse.Success = true;

            }
            catch (Exception ex)
            {
                Log.Error($"Error during login attempt for user {user.Username}: {ex.Message}");
                loginResponse.token = null;
                loginResponse.successResponse.Success = false;
                loginResponse.successResponse.Message = $"Error during login attempt for user {user.Username}: {ex.Message}";

            }
            return loginResponse;
        }


        private string ValidateUserCredentials(User user)
        {
            if (string.IsNullOrWhiteSpace(user?.Username) || string.IsNullOrWhiteSpace(user?.Password))
            {
                return "Username and password are required.";
            }

            if (user.Username.Length < 3)
            {
                return "Username must be at least 3 characters long.";
            }

            if (user.Password.Length < 6)
            {
                return "Password must be at least 6 characters long.";
            }

            return string.Empty;
        }


    }
}

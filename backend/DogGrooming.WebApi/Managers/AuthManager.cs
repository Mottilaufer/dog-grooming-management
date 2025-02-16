using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using DogGrooming.WebApi.Helpers;
using DogGrooming.Models.ApiResponse; // הוספת ה-using

namespace DogGrooming.WebApi.Managers
{
    public class AuthManager
    {
        private readonly UserRepository _userRepository;
        private readonly JwtManager _jwtManager;
        private readonly PasswordHasher _passwordHasher; // הוספנו את ה-PasswordHasher

        public AuthManager(UserRepository userRepository, JwtManager jwtManager, PasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _jwtManager = jwtManager;
            _passwordHasher = passwordHasher; // אתחול ה-PasswordHasher
        }

        public async Task<UserRegistrationResult> RegisterUserAsync(User user)
        {
            UserRegistrationResult userRegistrationResult = new ();
            userRegistrationResult.successResponse = new();
            string message = string.Empty;
            try
            {
                Log.Information($"Attempting to register user: {user.Username}");

                // חשיבת ה-Hash וה-Salt עבור הסיסמה
                var (passwordHash, passwordSalt) = _passwordHasher.HashPassword(user.Password);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;

                // רישום משתמש
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
                if (string.IsNullOrWhiteSpace(user?.Username) || string.IsNullOrWhiteSpace(user?.Password))
                {
                    loginResponse.successResponse.Message = "Username and password are required.";
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

                // יצירת טוקן JWT למשתמש
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


    }
}

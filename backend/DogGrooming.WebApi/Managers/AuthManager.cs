using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using DogGrooming.WebApi.Helpers; // הוספת ה-using

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

                // חיפוש המשתמש בבסיס הנתונים לפי שם המשתמש בלבד
                var existingUser = await _userRepository.AuthenticateUserAsync(user.Username);

                if (existingUser == null)
                {
                    Log.Warning($"User {user.Username} not found.");
                    return new UnauthorizedObjectResult("Invalid credentials.");
                }

                // חישוב ה-Hash מחדש בעזרת הסיסמה הגולמית שהלקוח שלח והסוללה שנמצאת ב-DB
                if (!_passwordHasher.VerifyPassword(user.Password, existingUser.PasswordHash, existingUser.PasswordSalt))
                {
                    Log.Warning($"Invalid password for user: {user.Username}");
                    return new UnauthorizedObjectResult("Invalid credentials.");
                }

                Log.Information($"User {user.Username} authenticated successfully.");

                // יצירת טוקן JWT למשתמש
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

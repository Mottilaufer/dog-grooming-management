using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using DogGrooming.Models;
using Serilog;

namespace DogGrooming.WebApi.Managers
{
    public class JwtManager
    {
        private readonly IConfiguration _configuration;

        public JwtManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(User user)
        {
            // שלב ראשוני – קריאה להגדרות JWT
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            // לוג - התחלת יצירת JWT
            Log.Information($"Starting JWT token generation for user: {user.Username}");

            // הגדרת תביעות (Claims) 
            var claims = new[]
            {
                new Claim("user", user.Username),
                new Claim("id", user.Id.ToString())
            };

            // הגדרת מפתחות לחתימה
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            // יצירת הטוקן
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(int.Parse(jwtSettings["ExpireDays"])),
                signingCredentials: credentials
            );

            // לוג - סיום יצירת טוקן
            Log.Information($"JWT token generated successfully for user: {user.Username}");

            // החזרת הטוקן שנוצר
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

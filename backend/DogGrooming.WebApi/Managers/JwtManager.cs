using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using DogGrooming.Models;
using Serilog;
using DogGrooming.WebApi.Interfaces;

namespace DogGrooming.WebApi.Managers
{
    public class JwtManager : IJwtManager
    {
        private readonly IConfiguration _configuration;

        public JwtManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            Log.Information($"Starting JWT token generation for user: {user.Username}");

            var claims = new[]
            {
                new Claim("user", user.Username),
                new Claim("id", user.Id.ToString())
            };

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(int.Parse(jwtSettings["ExpireDays"])),
                signingCredentials: credentials
            );

            Log.Information($"JWT token generated successfully for user: {user.Username}");

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

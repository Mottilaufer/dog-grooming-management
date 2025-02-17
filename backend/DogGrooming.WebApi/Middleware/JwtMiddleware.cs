using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<JwtMiddleware> _logger;

    public JwtMiddleware(RequestDelegate next, ILogger<JwtMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                {
                    _logger.LogWarning("Invalid JWT token format.");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Invalid token format.");
                    return;
                }

                var userId = jwtToken.Claims.FirstOrDefault(x => x.Type == "id").Value;

                _logger.LogInformation($"JWT Token: {token}");
                _logger.LogInformation($"Extracted User ID: {userId}");

                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("User ID not found in token.");
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Unauthorized: User ID missing.");
                    return;
                }

                context.Items["UserId"] = userId;
            }
            catch
            {
                _logger.LogWarning("Error processing JWT token.");
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized: Invalid token.");
                return;
            }
        }

        await _next(context);
    }
}

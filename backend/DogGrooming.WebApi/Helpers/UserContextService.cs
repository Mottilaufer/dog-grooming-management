using DogGrooming.WebApi.Interfaces;
using System.Security.Claims;

namespace DogGrooming.WebApi.Helpers
{
 
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirst("id")?.Value;
        }
    }

}

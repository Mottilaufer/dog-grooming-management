using DogGrooming.Models;

namespace DogGrooming.WebApi.Interfaces
{
    public interface IJwtManager
    {
        string GenerateJwtToken(User user);
    }
}

using DogGrooming.DAL.Repositories;
using DogGrooming.Models.ApiResponse;
using DogGrooming.Models;
using Serilog;

namespace DogGrooming.WebApi.Interfaces
{
    public interface IAuthManager
    {
        Task<LoginResponse> LoginAsync(User user);
        Task<UserRegistrationResult> RegisterUserAsync(User user);
    }
}

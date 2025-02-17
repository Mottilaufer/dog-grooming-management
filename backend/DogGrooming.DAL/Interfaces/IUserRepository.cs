using DogGrooming.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.DAL.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<UserRegistrationResult> RegisterUserAsync(User user);
        Task<User?> AuthenticateUserAsync(string username);
    }
}

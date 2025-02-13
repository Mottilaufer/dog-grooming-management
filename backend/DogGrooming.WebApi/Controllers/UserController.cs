using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DogGrooming.DAL.Repositories;
using DogGrooming.Models;

namespace DogGrooming.WebApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize] 
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;

        public UserController(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }
    }
}

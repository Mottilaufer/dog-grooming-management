using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DogGrooming.Models;

namespace DogGrooming.DAL.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<User?> AuthenticateUserAsync(string username, string passwordHash)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(
                "AuthenticateUser",
                new { Username = username, PasswordHash = passwordHash },
                commandType: CommandType.StoredProcedure);
        }



        public async Task<UserRegistrationResult> RegisterUserAsync(User user)
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                var parameters = new DynamicParameters();
                parameters.Add("Username", user.Username);
                parameters.Add("PasswordHash", user.PasswordHash);
                parameters.Add("PasswordSalt", user.PasswordSalt);
                parameters.Add("FullName", user.FullName);
                parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);
                parameters.Add("UserId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                await connection.ExecuteAsync("RegisterUser", parameters, commandType: CommandType.StoredProcedure);

                return new UserRegistrationResult
                {
                    Status = parameters.Get<int>("Status"),
                    UserId = parameters.Get<int?>("UserId"),
                    Message = parameters.Get<int>("Status") switch
                    {
                        1 => "User registered successfully!",
                        0 => "Username already exists.",
                        -1 => "An error occurred while registering the user.",
                        _ => "Unexpected error occurred."
                    }
                };
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"SQL Error: {ex.Message}");
                return new UserRegistrationResult
                {
                    Status = -2,
                    UserId = null,
                    Message = "Database error occurred."
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected Error: {ex.Message}");
                return new UserRegistrationResult
                {
                    Status = -3,
                    UserId = null,
                    Message = "Unexpected error occurred."
                };
            }
        }



        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<User>("GetAllUsers", commandType: CommandType.StoredProcedure);
        }

    }
}

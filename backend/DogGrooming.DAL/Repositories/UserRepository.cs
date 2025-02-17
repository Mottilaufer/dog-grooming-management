using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using DogGrooming.Models;
using Serilog;
using DogGrooming.DAL.Interfaces;

namespace DogGrooming.DAL.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<User?> AuthenticateUserAsync(string username)
        {
            using var connection = new SqlConnection(_connectionString);
            try
            {
                Log.Information("Authenticating user: {Username}", username);

                var user = await connection.QuerySingleOrDefaultAsync<User>(
                    "AuthenticateUser",
                    new { Username = username },
                    commandType: CommandType.StoredProcedure);

                if (user == null)
                {
                    Log.Warning("Authentication failed for user: {Username}", username);
                }
                else
                {
                    Log.Information("User authenticated successfully: {Username}", username);
                }

                return user;
            }
            catch (SqlException ex)
            {
                Log.Error("SQL Error during authentication: {Message}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Log.Error("Unexpected error during authentication: {Message}", ex.Message);
                throw;
            }
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

                Log.Information("Attempting to register user: {Username}", user.Username);
                await connection.ExecuteAsync("RegisterUser", parameters, commandType: CommandType.StoredProcedure);

                var status = parameters.Get<int>("Status");
                var userId = parameters.Get<int?>("UserId");

                var message = status switch
                {
                    1 => "User registered successfully!",
                    0 => "Username already exists.",
                    -1 => "An error occurred while registering the user.",
                    _ => "Unexpected error occurred."
                };

                Log.Information("Registration result for {Username}: {Message}", user.Username, message);

                return new UserRegistrationResult
                {
                    Status = status,
                    UserId = userId,
                    Message = message
                };
            }
            catch (SqlException ex)
            {
                Log.Error("SQL Error during registration: {Message}", ex.Message);
                return new UserRegistrationResult
                {
                    Status = -2,
                    UserId = null,
                    Message = "Database error occurred."
                };
            }
            catch (Exception ex)
            {
                Log.Error("Unexpected error during registration: {Message}", ex.Message);
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
            try
            {
                Log.Information("Fetching all users from the database.");
                var users = await connection.QueryAsync<User>("GetAllUsers", commandType: CommandType.StoredProcedure);

                Log.Information("Retrieved {Count} users from the database.", users.Count());

                return users;
            }
            catch (SqlException ex)
            {
                Log.Error("SQL Error while retrieving users: {Message}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Log.Error("Unexpected error while retrieving users: {Message}", ex.Message);
                throw;
            }
        }
    }
}

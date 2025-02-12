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

        public async Task<User?> AuthenticateUserAsync(string username)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QuerySingleOrDefaultAsync<User>(
                "AuthenticateUser", new { Username = username }, commandType: CommandType.StoredProcedure);
        }

        public async Task<int> RegisterUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("Username", user.Username);
            parameters.Add("PasswordHash", user.PasswordHash);
            parameters.Add("PasswordSalt", user.PasswordSalt);
            parameters.Add("FullName", user.FullName);
            parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("RegisterUser", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("Status");
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<User>("GetAllUsers", commandType: CommandType.StoredProcedure);
        }

    }
}

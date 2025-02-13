using Dapper;
using DogGrooming.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DogGrooming.DAL.Repositories
{
    public class AppointmentRepository
    {
        private readonly string _connectionString;

        public AppointmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<AppointmentResult> AddAppointmentAsync(int userId, DateTime appointmentTime)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("AppointmentTime", appointmentTime);
            parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("AddAppointment", parameters, commandType: CommandType.StoredProcedure);

            return new AppointmentResult
            {
                Status = parameters.Get<int>("Status"),
                Message = parameters.Get<int>("Status") == 1 ? "Appointment added successfully" : "Appointment already exists"
            };
        }

        public async Task<AppointmentResult> UpdateAppointmentAsync(int userId, DateTime appointmentTime, byte[] rowVersion)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("AppointmentTime", appointmentTime);
            parameters.Add("RowVer", rowVersion);
            parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("UpdateAppointment", parameters, commandType: CommandType.StoredProcedure);

            return new AppointmentResult
            {
                Status = parameters.Get<int>("Status"),
                Message = parameters.Get<int>("Status") == 1 ? "Appointment updated successfully" : "Update failed"
            };
        }

        public async Task<AppointmentResult> DeleteAppointmentAsync(int userId, DateTime appointmentTime, byte[] rowVersion)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("AppointmentTime", appointmentTime);
            parameters.Add("RowVer", rowVersion);
            parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("DeleteAppointment", parameters, commandType: CommandType.StoredProcedure);

            return new AppointmentResult
            {
                Status = parameters.Get<int>("Status"),
                Message = parameters.Get<int>("Status") == 1 ? "Appointment deleted successfully" : "Delete failed"
            };
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByUserAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<Appointment>("GetAppointmentsByUser", new { UserId = userId }, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(DateTime date)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<Appointment>("GetAppointmentsByDate", new { Date = date }, commandType: CommandType.StoredProcedure);
        }
    }
}

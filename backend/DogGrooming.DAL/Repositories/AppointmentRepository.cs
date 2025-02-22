﻿using Dapper;
using DogGrooming.DAL.Interfaces;
using DogGrooming.Models;
using DogGrooming.Models.ApiResponse;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Serilog;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace DogGrooming.DAL.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly string _connectionString;

        public AppointmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<AppointmentResult> AddAppointmentAsync(int userId, DateTime appointmentTime)
        {
            var rowVer = Guid.NewGuid();
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("AppointmentTime", appointmentTime);
            parameters.Add("RowVer", rowVer);
            parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("AddAppointment", parameters, commandType: CommandType.StoredProcedure);

            return new AppointmentResult
            {
                Status = parameters.Get<int>("Status"),
                Message = parameters.Get<int>("Status") == 1 ? "Appointment added successfully" : "Appointment already exists"
            };
        }

        public async Task<AppointmentResult> UpdateAppointmentAsync(int userId, string rowVersion, DateTime updateAppointmentTime,int id)
        {
            try
            {
     
                using var connection = new SqlConnection(_connectionString);
                var parameters = new DynamicParameters();
                parameters.Add("UserId", userId);
                parameters.Add("Id", id);
                parameters.Add("UpdateAppointmentTime", updateAppointmentTime); 
                parameters.Add("RowVer", rowVersion);
                parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);

                await connection.ExecuteAsync("UpdateAppointment", parameters, commandType: CommandType.StoredProcedure);

                return new AppointmentResult
                {
                    Status = parameters.Get<int>("Status"),
                    Message = parameters.Get<int>("Status") == 1 ? "Appointment updated successfully" : "Update failed"
                };

            }
            catch(Exception ex)
            {
                throw;
            }
            
        }

        public async Task<AppointmentResult> DeleteAppointmentAsync(int userId, int id)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);
            parameters.Add("Id", id);
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
            try
            {
                using var connection = new SqlConnection(_connectionString);

                var appointmentsRaw = await connection.QueryAsync<dynamic>(
                    "GetAppointmentsByUser",
                    new { UserId = userId },
                    commandType: CommandType.StoredProcedure
                );

                var appointments = appointmentsRaw.Select(appointmentRaw => new Appointment
                {
                    UserId = appointmentRaw.UserId,
                    AppointmentTime = appointmentRaw.AppointmentTime,
                    RowVer = appointmentRaw.RowVer.ToString()  
                }).ToList();

                return appointments;
            }
            catch (Exception ex)
            {
                Log.Error($"Error fetching appointments for user {userId}: {ex.Message}");
                return new List<Appointment>();
            }
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(DateTime date)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<Appointment>("GetAppointmentsByDate", new { Date = date }, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<OccupiedAppointmentResponse>> GetOccupiedAppointmentsAsync()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                var query = "EXEC GetOccupiedAppointments";
                return (await connection.QueryAsync<OccupiedAppointmentResponse>(query)).AsList();

            }
            catch(Exception ex)
            {
                Log.Error($"Error fetching appointments : {ex.Message}");
                throw;
            }
 
        }

        public async Task<List<AvailableDay>> GetAvailableAppointmentSlots()
        {
            try
            {
                using var connection = new SqlConnection(_connectionString);
                var query = "EXEC GetAvailableAppointmentSlots";

                var flatData = await connection.QueryAsync<(string AppointmentDate, string AppointmentTime, bool IsBooked)>(query);

                var groupedData = flatData
                    .GroupBy(d => d.AppointmentDate) 
                    .Select(g => new AvailableDay
                    {
                        Date = g.Key,
                        Slots = g.Select(s => new TimeSlot
                        {
                            Time = s.AppointmentTime,
                            IsBooked = s.IsBooked
                        }).ToList()
                    })
                    .ToList();

                return groupedData;
            }
            catch(Exception ex)
            {
                Log.Error($"Error fetching שvailable appointments : {ex.Message}");
                throw;
            }
           
        }

    }
}

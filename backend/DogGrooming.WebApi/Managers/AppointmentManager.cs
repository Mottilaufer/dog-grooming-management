using DogGrooming.DAL.Interfaces;
using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using DogGrooming.Models.ApiResponse;
using DogGrooming.WebApi.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace DogGrooming.WebApi.Managers
{
    public class AppointmentManager : IAppointmentManager
    {
        private readonly IUserRepository _userRepository;
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentManager(IUserRepository userRepository, IAppointmentRepository appointmentRepository)
        {
            _userRepository = userRepository;
            _appointmentRepository = appointmentRepository;
        }



        public async Task<AppointmentResponse> UpdateAppointmentAsync(int userId,  string rowVer, DateTime updateAppointmentTime, int id)
        {
            AppointmentResponse appointmentResponse = new();

            try
            {
                Log.Information($"Attempting to update appointment for user {userId} - updated appointment {updateAppointmentTime}");
                var result = await _appointmentRepository.UpdateAppointmentAsync(userId, rowVer, updateAppointmentTime,id);
                appointmentResponse.successResponse = new SuccessResponse { Success = result.Status == 1, Message = result.Message };
                appointmentResponse.Data = new List<Appointment>();  
            }
            catch (Exception ex)
            {
                Log.Error($"Error updating appointment for user {userId} {userId} - updated appointment {updateAppointmentTime}: {ex.Message}");
                appointmentResponse.successResponse = new SuccessResponse { Success = false, Message = "Error updating appointment." };
                appointmentResponse.Data = new List<Appointment>();
            }

            return appointmentResponse;
        }


        public async Task<AppointmentResponse> DeleteAppointmentAsync(int userId, int id)
        {
            AppointmentResponse appointmentResponse = new();

            try
            {
                Log.Information($"Attempting to delete appointment for user {userId} at appointmentID {id}");
                var result = await _appointmentRepository.DeleteAppointmentAsync(userId,id);
                appointmentResponse.successResponse = new SuccessResponse { Success = result.Status == 1, Message = result.Message };
                appointmentResponse.Data = new List<Appointment>(); 
            }
            catch (Exception ex)
            {
                Log.Error($"Error deleting appointment for user {userId} at appointmentID {id}");
                appointmentResponse.successResponse = new SuccessResponse { Success = false, Message = "Error deleting appointment." };
                appointmentResponse.Data = new List<Appointment>();
            }

            return appointmentResponse;
        }

        public async Task<AppointmentResponse> GetAppointmentsByUserAsync(int userId)
        {
            AppointmentResponse appointmentResponse = new();
            appointmentResponse.Data = new List<Appointment>();

            try
            {
                Log.Information($"Fetching appointments for user {userId}");

                var appointments = await _appointmentRepository.GetAppointmentsByUserAsync(userId);

                if (appointments == null || !appointments.Any())
                {
                    Log.Warning($"No appointments found for user {userId}");

                    appointmentResponse.successResponse = new SuccessResponse { Success = true, Message = "No appointments found for this user." };
                    return appointmentResponse; 
                }

                appointmentResponse.successResponse = new SuccessResponse { Success = true, Message = "Appointments retrieved successfully." };
                appointmentResponse.Data = appointments; 
            }
            catch (Exception ex)
            {
                Log.Error($"Error fetching appointments for user {userId}: {ex.Message}");
                appointmentResponse.successResponse = new SuccessResponse { Success = false, Message = "Error fetching appointments." };
            }

            return appointmentResponse; 
        }


        public async Task<AppointmentResponse> GetAppointmentsByDateAsync(DateTime date)
        {
            AppointmentResponse appointmentResponse = new();
            appointmentResponse.Data = new List<Appointment>(); 
            try
            {
                Log.Information($"Fetching appointments for date {date}");


                var appointments = await _appointmentRepository.GetAppointmentsByDateAsync(date);

     
                if (appointments == null || !appointments.Any())
                {
                    Log.Warning($"No appointments found for date {date}");

                    appointmentResponse.successResponse = new SuccessResponse { Success = true, Message = "No appointments found for the specified date." };
                    return appointmentResponse;

                }


                appointmentResponse.successResponse = new SuccessResponse { Success = true, Message = "Appointments retrieved successfully." };
                appointmentResponse.Data = appointments;
               
            }
            catch (Exception ex)
            {
                Log.Error($"Error fetching appointments for date {date}: {ex.Message}");
                appointmentResponse.successResponse = new SuccessResponse { Success = false, Message = "Error fetching appointments." };
            }

            return appointmentResponse;
        }

        public async Task<AppointmentResponse> AddAppointmentAsync(int userId, DateTime appointmentTime)
        {
            AppointmentResponse appointmentResponse = new();

            try
            {
                Log.Information($"Attempting to add appointment for user {userId} at {appointmentTime}");

      
                var existingAppointment = await _appointmentRepository.GetAppointmentsByUserAsync(userId);
                if (existingAppointment.Any(a => a.AppointmentTime == appointmentTime))
                {
                    Log.Warning($"User {userId} tried to add a conflicting appointment at {appointmentTime}");

                    appointmentResponse.successResponse = new SuccessResponse { Success = false, Message = "Appointment already exists at this time." };
                    appointmentResponse.Data = new List<Appointment>();  
                    return appointmentResponse;
                }

        
                var result = await _appointmentRepository.AddAppointmentAsync(userId, appointmentTime);
                appointmentResponse.successResponse = new SuccessResponse { Success = result.Status == 1, Message = result.Message };
                appointmentResponse.Data = new List<Appointment>();
            }
            catch (Exception ex)
            {
                Log.Error($"Error adding appointment for user {userId} at {appointmentTime}: {ex.Message}");
                appointmentResponse.successResponse = new SuccessResponse { Success = false, Message = "Error adding appointment." };
                appointmentResponse.Data = new List<Appointment>();
            }

            return appointmentResponse;
        }

        public async Task<List<OccupiedAppointmentResponse>> GetOccupiedAppointmentsAsync()
        {
            var occupiedAppointmentResponse = await _appointmentRepository.GetOccupiedAppointmentsAsync();
            return occupiedAppointmentResponse;
        }

        public async Task<List<AvailableDay>> GetAvailableSlotsAsync()
        {
            var availableSlotsResponse = await _appointmentRepository.GetAvailableAppointmentSlots();
            return availableSlotsResponse;
        }
    }
}

using DogGrooming.DAL.Repositories;
using DogGrooming.Models;
using Serilog;

namespace DogGrooming.WebApi.Managers
{
    public class AppointmentManager
    {
        private readonly UserRepository _userRepository;
        private readonly AppointmentRepository _appointmentRepository;

        public AppointmentManager(UserRepository userRepository, AppointmentRepository appointmentRepository)
        {
            _userRepository = userRepository;
            _appointmentRepository = appointmentRepository;
        }



        public async Task<AppointmentResult> UpdateAppointmentAsync(int userId, DateTime appointmentTime, byte[] rowVersion)
        {
            try
            {
                Log.Information($"Updating appointment for user {userId} at {appointmentTime}");

              
                var existingAppointments = await _appointmentRepository.GetAppointmentsByUserAsync(userId);
                if (!existingAppointments.Any(a => a.AppointmentTime == appointmentTime))
                {
                    Log.Warning($"User {userId} tried to update an appointment that doesn't exist.");
                    return new AppointmentResult { Status = -1, Message = "Appointment not found." };
                }

                return await _appointmentRepository.UpdateAppointmentAsync(userId, appointmentTime, rowVersion);
            }
            catch (Exception ex)
            {
                Log.Error($"Error updating appointment: {ex.Message}");
                return new AppointmentResult { Status = -1, Message = "Failed to update appointment." };
            }
        }

        public async Task<AppointmentResult> DeleteAppointmentAsync(int userId, DateTime appointmentTime, byte[] rowVersion)
        {
            try
            {
                Log.Information($"Deleting appointment for user {userId} at {appointmentTime}");

                var existingAppointments = await _appointmentRepository.GetAppointmentsByUserAsync(userId);
                if (!existingAppointments.Any(a => a.AppointmentTime == appointmentTime))
                {
                    Log.Warning($"User {userId} tried to delete an appointment that doesn't exist.");
                    return new AppointmentResult { Status = -1, Message = "Appointment not found." };
                }

                return await _appointmentRepository.DeleteAppointmentAsync(userId, appointmentTime, rowVersion);
            }
            catch (Exception ex)
            {
                Log.Error($"Error deleting appointment: {ex.Message}");
                return new AppointmentResult { Status = -1, Message = "Failed to delete appointment." };
            }
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByUserAsync(int userId)
        {
            try
            {
                Log.Information($"Fetching appointments for user {userId}");
                return await _appointmentRepository.GetAppointmentsByUserAsync(userId);
            }
            catch (Exception ex)
            {
                Log.Error($"Error fetching appointments for user {userId}: {ex.Message}");
                return new List<Appointment>();
            }
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(DateTime date)
        {
            try
            {
                Log.Information($"Fetching appointments for date {date}");
                return await _appointmentRepository.GetAppointmentsByDateAsync(date);
            }
            catch (Exception ex)
            {
                Log.Error($"Error fetching appointments for date {date}: {ex.Message}");
                return new List<Appointment>();
            }
        }

        public async Task<AppointmentResult> AddAppointmentAsync(int userId, DateTime appointmentTime)
        {
            try
            {
                Log.Information($"Adding appointment for user {userId} at {appointmentTime}");

                // ווידוא שהתור לא מתנגש
                var existingAppointment = await _appointmentRepository.GetAppointmentsByUserAsync(userId);
                if (existingAppointment.Any(a => a.AppointmentTime == appointmentTime))
                {
                    Log.Warning($"User {userId} tried to add a conflicting appointment at {appointmentTime}");
                    return new AppointmentResult { Status = -1, Message = "Appointment already exists at this time." };
                }

                return await _appointmentRepository.AddAppointmentAsync(userId, appointmentTime);
            }
            catch (Exception ex)
            {
                Log.Error($"Error adding appointment: {ex.Message}");
                return new AppointmentResult { Status = -1, Message = "Failed to add appointment." };
            }
        }

    }
}

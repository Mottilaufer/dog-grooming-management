using DogGrooming.DAL.Repositories;
using DogGrooming.Models.ApiResponse;
using DogGrooming.Models;
using Serilog;

namespace DogGrooming.WebApi.Interfaces
{
    public interface IAppointmentManager
    {
        Task<List<AvailableDay>> GetAvailableSlotsAsync();
        Task<AppointmentResponse> UpdateAppointmentAsync(int userId, string rowVer, DateTime updateAppointmentTime, int id);
        Task<AppointmentResponse> DeleteAppointmentAsync(int userId, int id);
        Task<AppointmentResponse> GetAppointmentsByUserAsync(int userId);
        Task<AppointmentResponse> GetAppointmentsByDateAsync(DateTime date);
        Task<AppointmentResponse> AddAppointmentAsync(int userId, DateTime appointmentTime);
        Task<List<OccupiedAppointmentResponse>> GetOccupiedAppointmentsAsync();
    }
}
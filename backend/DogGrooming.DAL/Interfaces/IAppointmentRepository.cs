using DogGrooming.Models;
using DogGrooming.Models.ApiResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.DAL.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<List<AvailableDay>> GetAvailableAppointmentSlots();
        Task<AppointmentResult> UpdateAppointmentAsync(int userId, string rowVersion, DateTime updateAppointmentTime, int id);
        Task<AppointmentResult> DeleteAppointmentAsync(int userId, int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByUserAsync(int userId);
        Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(DateTime date);
        Task<List<OccupiedAppointmentResponse>> GetOccupiedAppointmentsAsync();
        Task<AppointmentResult> AddAppointmentAsync(int userId, DateTime appointmentTime);
    }
}

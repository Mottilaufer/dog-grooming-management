using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DogGrooming.WebApi.Managers;
using DogGrooming.Models;
using DogGrooming.WebApi.Interfaces;

namespace DogGrooming.WebApi.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    [Authorize]
    
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentManager _appointmentManager;

        public AppointmentController(IAppointmentManager appointmentManager)
        {
            _appointmentManager = appointmentManager;
        }

        [HttpPost("add-appointment")]
        public async Task<IActionResult> AddAppointment([FromBody] Appointment appointment)
        {
            var result = await _appointmentManager.AddAppointmentAsync(appointment.UserId, appointment.AppointmentTime);
            return Ok(result); 
        }

        [HttpPut("update-appointment")]
        public async Task<IActionResult> UpdateAppointment([FromBody] Appointment appointment)
        {
            var result = await _appointmentManager.UpdateAppointmentAsync(appointment.UserId, appointment.RowVer , appointment.UpdateAppointmentTime, appointment.id);
            return Ok(result);
        }

        [HttpDelete("delete-appointment")]
        public async Task<IActionResult> DeleteAppointment([FromBody] Appointment appointment)
        {
            var result = await _appointmentManager.DeleteAppointmentAsync(appointment.UserId, appointment.id);
            return Ok(result); 
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAppointmentsByUser(int userId)
        {
            var appointments = await _appointmentManager.GetAppointmentsByUserAsync(userId);
            return Ok(appointments); 
        }

        [HttpGet("date/{date}")]
        public async Task<IActionResult> GetAppointmentsByDate(DateTime date)
        {
            var appointments = await _appointmentManager.GetAppointmentsByDateAsync(date);
            return Ok(appointments); 
        }

        [HttpGet("occupied-appointments")]
        public async Task<IActionResult> GetOccupiedAppointments()
        {
            var result = await _appointmentManager.GetOccupiedAppointmentsAsync();
            return Ok(result);
        }
        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots()
        {
            var result = await _appointmentManager.GetAvailableSlotsAsync();
            return Ok(result);
        }


    }
}

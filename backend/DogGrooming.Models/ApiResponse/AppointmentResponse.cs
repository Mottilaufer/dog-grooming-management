using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models.ApiResponse
{
    public class AppointmentResponse
    {
        public SuccessResponse successResponse { get; set; }
        public IEnumerable<Appointment> Data { get; set; }
    }
}


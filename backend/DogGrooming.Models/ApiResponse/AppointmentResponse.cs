using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models.ApiResponse
{
    public class AppointmentResponse
    {
        public IsSuccess Status { get; set; }
        public IEnumerable<Appointment> Data { get; set; }
    }
}


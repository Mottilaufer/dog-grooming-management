using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models
{
    public class Appointment
    {
        public int UserId { get; set; }
        public int id { get; set; }
        public DateTime AppointmentTime { get; set; }
        public DateTime UpdateAppointmentTime { get; set; }
        public string RowVer { get; set; }
    }
}


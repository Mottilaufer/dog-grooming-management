using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models.ApiResponse
{
    public class OccupiedAppointmentResponse
    {
        public string AppointmentDate { get; set; }
        public string CreatedAt { get; set; }
        public string AppointmentTime { get; set; }
        public int UserId { get; set; }
        public int Id { get; set; }
        public string FullName { get; set; }
        public string RowVer { get; set; }


    }
}

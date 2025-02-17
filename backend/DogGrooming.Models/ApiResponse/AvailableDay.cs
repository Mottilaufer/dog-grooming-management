using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models.ApiResponse
{
    public class AvailableDay
    {
        public string Date { get; set; }
        public List<TimeSlot> Slots { get; set; }
    }
    public class TimeSlot
    {
        public string Time { get; set; }
        public bool IsBooked { get; set; }
    }
}

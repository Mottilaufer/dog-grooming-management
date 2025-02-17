using DogGrooming.Models.ApiResponse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models
{
    public class UserRegistrationResult
    {
        public SuccessResponse successResponse { get; set; }
        public int Status { get; set; } 
        public int? UserId { get; set; } 
        public string Message { get; set; } 
    }
}

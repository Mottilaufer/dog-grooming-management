using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models.ApiResponse
{
    public class LoginResponse
    {
        public string token { get; set; }
        public SuccessResponse successResponse { get; set; }
    }
}

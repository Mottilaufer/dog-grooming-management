using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; } 
        public string PasswordSalt { get; set; } 
        public string FullName { get; set; }
    }
}


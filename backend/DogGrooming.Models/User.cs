using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DogGrooming.Models
{
    public class User
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("passwordHash")]
        public string PasswordHash { get; set; }
        [JsonPropertyName("passwordSalt")]
        public string PasswordSalt { get; set; }
        [JsonPropertyName("fullName")]
        public string FullName { get; set; }
    }
}


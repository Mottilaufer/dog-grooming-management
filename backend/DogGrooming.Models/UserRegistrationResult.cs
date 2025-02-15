using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DogGrooming.Models
{
    public class UserRegistrationResult
    {
        public int Status { get; set; } // 1 - הצלחה, 0 - שם משתמש קיים, -1 - שגיאה
        public int? UserId { get; set; } // מזהה המשתמש, אם נוצר
        public string Message { get; set; } // הודעה למשתמש
    }
}

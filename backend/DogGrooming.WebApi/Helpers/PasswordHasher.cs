using System.Security.Cryptography;
using System.Text;

namespace DogGrooming.WebApi.Helpers
{
    public class PasswordHasher
    {
        private const int SaltSize = 16; // גודל הסאלט
        private const int Iterations = 10000; // מספר האיטרציות
        private const int HashSize = 32; // גודל ההאש

        // פונקציה לחישוב ה-passwordHash וה-passwordSalt
        public (string passwordHash, string passwordSalt) HashPassword(string password)
        {
            // יצירת סאלט רנדומלי
            using (var rng = new RNGCryptoServiceProvider())
            {
                var salt = new byte[SaltSize];
                rng.GetBytes(salt);

                // חישוב ה-hash בעזרת PBKDF2
                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
                {
                    var hash = pbkdf2.GetBytes(HashSize);
                    return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
                }
            }
        }

        // פונקציה לבדוק אם הסיסמה נכונה
        public bool VerifyPassword(string enteredPassword, string storedPasswordHash, string storedPasswordSalt)
        {
            var salt = Convert.FromBase64String(storedPasswordSalt);
            using (var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, salt, Iterations))
            {
                var hash = pbkdf2.GetBytes(HashSize);
                return storedPasswordHash == Convert.ToBase64String(hash);
            }
        }
    }
}

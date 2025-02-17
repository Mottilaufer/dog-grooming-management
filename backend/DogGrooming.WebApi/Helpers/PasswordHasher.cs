using DogGrooming.WebApi.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace DogGrooming.WebApi.Helpers
{
    public class PasswordHasher : IPasswordHasher
    {
        private const int SaltSize = 16; 
        private const int Iterations = 10000; 
        private const int HashSize = 32; 

     
        public (string passwordHash, string passwordSalt) HashPassword(string password)
        {
          
            using (var rng = new RNGCryptoServiceProvider())
            {
                var salt = new byte[SaltSize];
                rng.GetBytes(salt);

                using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
                {
                    var hash = pbkdf2.GetBytes(HashSize);
                    return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
                }
            }
        }

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

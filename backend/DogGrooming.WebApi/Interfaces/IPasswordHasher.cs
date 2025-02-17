namespace DogGrooming.WebApi.Interfaces
{
    public interface IPasswordHasher
    {
        bool VerifyPassword(string enteredPassword, string storedPasswordHash, string storedPasswordSalt);
        (string passwordHash, string passwordSalt) HashPassword(string password);

    }
}

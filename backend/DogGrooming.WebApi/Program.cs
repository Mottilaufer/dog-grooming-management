using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using DogGrooming.DAL.Database;
using DogGrooming.DAL.Repositories;
using DogGrooming.WebApi.Managers;
using DogGrooming.WebApi.Configuration;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ✅ הוספת Serilog – כתיבת לוגים לקובץ
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()  // הצגת לוגים גם בקונסולה
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day) // קובץ לוגים יומי
    .CreateLogger();

builder.Host.UseSerilog(); // שימוש ב-Serilog במקום ה-Logger הרגיל

// 🔹 הגדרת JWT
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection("Jwt").Bind(jwtSettings);
var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

// 🔹 הוספת שירותים ל-DI
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<DatabaseContext>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<JwtManager>();

// 🔹 הוספת JWT Authentication
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

// 🔹 הוספת Swagger עם תמיכה ב-JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Dog Grooming API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "נא להזין את ה-Token בפורמט: Bearer {your_token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseMiddleware<JwtMiddleware>(); // שימוש ב-Middleware לאימות JWT
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ הדפסת הודעה ללוג על התחלת השרת
Log.Information("Starting Dog Grooming API...");

app.Run();

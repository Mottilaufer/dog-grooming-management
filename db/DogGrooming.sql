USE [master]
GO
/****** Object:  Database [DogGroomingDB]    Script Date: 2/18/2025 8:51:13 AM ******/
CREATE DATABASE [DogGroomingDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'DogGroomingDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\DogGroomingDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'DogGroomingDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\DogGroomingDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [DogGroomingDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [DogGroomingDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [DogGroomingDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [DogGroomingDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [DogGroomingDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [DogGroomingDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [DogGroomingDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [DogGroomingDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [DogGroomingDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [DogGroomingDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [DogGroomingDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [DogGroomingDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [DogGroomingDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [DogGroomingDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [DogGroomingDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [DogGroomingDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [DogGroomingDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [DogGroomingDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [DogGroomingDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [DogGroomingDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [DogGroomingDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [DogGroomingDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [DogGroomingDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [DogGroomingDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [DogGroomingDB] SET RECOVERY FULL 
GO
ALTER DATABASE [DogGroomingDB] SET  MULTI_USER 
GO
ALTER DATABASE [DogGroomingDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [DogGroomingDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [DogGroomingDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [DogGroomingDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [DogGroomingDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [DogGroomingDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'DogGroomingDB', N'ON'
GO
ALTER DATABASE [DogGroomingDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [DogGroomingDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [DogGroomingDB]
GO
/****** Object:  Table [dbo].[Appointments]    Script Date: 2/18/2025 8:51:13 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointments](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[AppointmentTime] [datetime] NOT NULL,
	[CreatedAt] [datetime] NULL,
	[RowVer] [uniqueidentifier] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [IX_Appointments_UserId_AppointmentTime] UNIQUE NONCLUSTERED 
(
	[UserId] ASC,
	[AppointmentTime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[PasswordSalt] [nvarchar](255) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IDX_Appointments_AppointmentTime]    Script Date: 2/18/2025 8:51:14 AM ******/
CREATE NONCLUSTERED INDEX [IDX_Appointments_AppointmentTime] ON [dbo].[Appointments]
(
	[AppointmentTime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IDX_Appointments_UserId]    Script Date: 2/18/2025 8:51:14 AM ******/
CREATE NONCLUSTERED INDEX [IDX_Appointments_UserId] ON [dbo].[Appointments]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Users_Username]    Script Date: 2/18/2025 8:51:14 AM ******/
CREATE NONCLUSTERED INDEX [IX_Users_Username] ON [dbo].[Users]
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Appointments] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointment_User]
GO
/****** Object:  StoredProcedure [dbo].[AddAppointment]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddAppointment]
    @UserId INT,
    @AppointmentTime DATETIME,
    @RowVer uniqueidentifier,  -- קבלת ה- GUID מה-backend
    @Status INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    -- בדיקת אם קיים תור לאותו משתמש באותו זמן
    IF EXISTS (SELECT 1 FROM dbo.Appointments WITH (UPDLOCK, HOLDLOCK) 
                WHERE AppointmentTime = @AppointmentTime)
    BEGIN
        SET @Status = 0;  -- אם כבר קיים, לא ניתן להוסיף תור חדש
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- הוספת תור חדש עם GUID ב-RowVer
    INSERT INTO dbo.Appointments (UserId, AppointmentTime, RowVer)
    VALUES (@UserId, @AppointmentTime, @RowVer);  -- הוספת ה-GUID

    SET @Status = 1;  -- הצלחה בהוספה
    COMMIT TRANSACTION;
END;
GO
/****** Object:  StoredProcedure [dbo].[AuthenticateUser]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AuthenticateUser]
    @Username NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Username, PasswordHash, PasswordSalt, FullName
    FROM dbo.Users
    WHERE Username = @Username;
END;
GO
/****** Object:  StoredProcedure [dbo].[DeleteAppointment]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DeleteAppointment]
    @UserId INT,
	@Id INT,
    @Status INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;


    IF NOT EXISTS (SELECT 1 FROM dbo.Appointments WITH (UPDLOCK, HOLDLOCK) 
                   WHERE UserId = @UserId 
                   AND Id = @Id)
    BEGIN
        SET @Status = 0;  
        ROLLBACK TRANSACTION;
        RETURN;
    END

    DELETE FROM dbo.Appointments
    WHERE UserId = @UserId AND Id = @Id


    SET @Status = 1;  
    COMMIT TRANSACTION;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAllUsers]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllUsers]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Username, FullName FROM dbo.Users;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAppointmentsByDate]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAppointmentsByDate]
    @Date DATE
AS
BEGIN
    SELECT * FROM dbo.Appointments WHERE CAST(AppointmentTime AS DATE) = @Date;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAppointmentsByUser]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAppointmentsByUser]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, AppointmentTime, RowVer , UserId
    FROM dbo.Appointments
    WHERE UserId = @UserId;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAvailableAppointmentSlots]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAvailableAppointmentSlots]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Dates TABLE (AppointmentDate NVARCHAR(10));
    INSERT INTO @Dates (AppointmentDate)
    SELECT CONVERT(NVARCHAR(10), DATEADD(DAY, n.Number, GETDATE()), 120) 
    FROM master.dbo.spt_values n
    WHERE n.Type = 'P' AND n.Number BETWEEN 0 AND 6; 

   
    DECLARE @TimeSlots TABLE (AppointmentTime NVARCHAR(5));
    INSERT INTO @TimeSlots (AppointmentTime)
    SELECT CONVERT(NVARCHAR(5), DATEADD(MINUTE, (30 * n.Number), '08:00'), 108) 
    FROM master.dbo.spt_values n
    WHERE n.Type = 'P' AND n.Number BETWEEN 0 AND 18; 

  
    SELECT 
        d.AppointmentDate,
        t.AppointmentTime,
        CASE 
            WHEN a.Id IS NOT NULL THEN 1 
            ELSE 0 
        END AS IsBooked
    FROM @Dates d
    CROSS JOIN @TimeSlots t
    LEFT JOIN Appointments a 
        ON d.AppointmentDate = CONVERT(NVARCHAR(10), CAST(a.AppointmentTime AS DATE), 120)
        AND t.AppointmentTime = CONVERT(NVARCHAR(5), CAST(a.AppointmentTime AS TIME), 108)
    ORDER BY d.AppointmentDate, t.AppointmentTime;
END;
GO
/****** Object:  StoredProcedure [dbo].[GetOccupiedAppointments]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetOccupiedAppointments]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        FORMAT(AppointmentTime, 'dd/MM/yyyy') AS AppointmentDate,  -- החזרת התאריך כ-string
        FORMAT(AppointmentTime, 'HH:mm') AS AppointmentTime,
        a.Id,
        u.FullName, 
        u.Id AS UserId,
		CAST(a.RowVer AS varchar(50)) AS RowVer,
        FORMAT(a.CreatedAt, 'dd/MM/yyyy') AS CreatedAt  -- החזרת התאריך של CreatedAt כ-string
    FROM dbo.Appointments a
    INNER JOIN dbo.Users u ON a.UserId = u.Id 
    ORDER BY AppointmentDate, AppointmentTime;
END;
GO
/****** Object:  StoredProcedure [dbo].[RegisterUser]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[RegisterUser]
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(255),
    @PasswordSalt NVARCHAR(255),
    @FullName NVARCHAR(100),
    @Status INT OUTPUT,  
    @UserId INT OUTPUT  
WITH EXECUTE AS OWNER -- בקרת הרשאות, מונע הרצה עם הרשאות גבוהות מידי
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @InsertedId INT;

    BEGIN TRANSACTION;


    IF EXISTS (SELECT 1 FROM dbo.Users WITH (UPDLOCK, HOLDLOCK) WHERE Username = @Username)
    BEGIN
        SET @Status = 0;  
        ROLLBACK TRANSACTION;
        RETURN;
    END

    BEGIN TRY

        INSERT INTO dbo.Users (Username, PasswordHash, PasswordSalt, FullName)
        VALUES (@Username, @PasswordHash, @PasswordSalt, @FullName);

     
        SET @InsertedId = SCOPE_IDENTITY();
        SET @UserId = @InsertedId;
        
  
        SET @Status = 1;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @Status = -1;  
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[UpdateAppointment]    Script Date: 2/18/2025 8:51:14 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UpdateAppointment]
    @UserId INT,
	@Id INT,      
    @UpdateAppointmentTime DATETIME,   
    @RowVer VARCHAR(255),               
    @Status INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;


    DECLARE @RowVerBinary UNIQUEIDENTIFIER;
    SET @RowVerBinary = CAST(@RowVer AS UNIQUEIDENTIFIER);  


    IF NOT EXISTS (SELECT 1 FROM dbo.Appointments WITH (UPDLOCK, HOLDLOCK) 
                   WHERE UserId = @UserId  
				   And Id = @Id
                   AND RowVer = @RowVerBinary)
    BEGIN
        SET @Status = 0;  
        ROLLBACK TRANSACTION;
        RETURN;
    END

   
    UPDATE dbo.Appointments
    SET AppointmentTime = @UpdateAppointmentTime, 
        RowVer = NEWID() 
    WHERE UserId = @UserId 
	AND Id = @Id
    AND RowVer = @RowVerBinary;

    SET @Status = 1;  
    COMMIT TRANSACTION;
END;
GO
USE [master]
GO
ALTER DATABASE [DogGroomingDB] SET  READ_WRITE 
GO

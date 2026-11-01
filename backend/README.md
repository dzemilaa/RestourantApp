# Bella Restaurant API

## Requirements

- .NET 8 SDK
- SQL Server database

## Local configuration

Create the empty SQL Server database schema from the repository root:

```powershell
sqlcmd -S ".\SQLEXPRESS" -E -i .\backend\database\schema.sql
```

The script creates `BellaRestaurantDb` if it does not exist and can be safely
re-run. It does not include or insert user, order, or product data. Change the
SQL Server instance in the command if yours has a different name.

Secrets are deliberately not stored in `appsettings.json`. Initialize User Secrets once:

```powershell
dotnet user-secrets set "ConnectionStrings:BazaCon" "Server=.\SQLEXPRESS;Database=BellaRestaurantDb;Trusted_Connection=True;TrustServerCertificate=True" --project .\backend\backend.csproj
dotnet user-secrets set "JwtSettings:SecretKey" "<random secret of at least 32 bytes>" --project .\backend\backend.csproj
dotnet user-secrets set "AppSettings:BaseUrl" "http://127.0.0.1:5173" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Host" "<SMTP host>" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Port" "587" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Username" "<SMTP username>" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Password" "<SMTP password>" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:FromEmail" "<sender email>" --project .\backend\backend.csproj
```

Run the API from this directory:

```powershell
dotnet run --project .\backend\backend.csproj --no-launch-profile -- --urls http://127.0.0.1:5080
```

The frontend's development default expects the API on
`http://127.0.0.1:5080`.

In deployment, provide the same settings through environment variables:
`ConnectionStrings__BazaCon`, `JwtSettings__SecretKey`,
`AppSettings__BaseUrl`, `SmtpSettings__Host`, `SmtpSettings__Port`,
`SmtpSettings__Username`, `SmtpSettings__Password`, and
`SmtpSettings__FromEmail`.

Never commit credentials, local publish profiles, or generated `bin`, `obj`, and
`publish` output.

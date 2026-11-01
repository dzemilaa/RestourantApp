# Bella Restaurant API

## Requirements

- .NET 8 SDK
- SQL Server database

## Local configuration

Secrets are deliberately not stored in `appsettings.json`. Initialize User Secrets once:

```powershell
dotnet user-secrets set "ConnectionStrings:BazaCon" "<SQL Server connection string>" --project .\backend\backend.csproj
dotnet user-secrets set "JwtSettings:SecretKey" "<random secret of at least 32 bytes>" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Username" "<SMTP username>" --project .\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Password" "<SMTP password>" --project .\backend\backend.csproj
```

Run the API from this directory:

```powershell
dotnet run --project .\backend\backend.csproj
```

In deployment, provide the same settings through environment variables:
`ConnectionStrings__BazaCon`, `JwtSettings__SecretKey`,
`SmtpSettings__Username`, and `SmtpSettings__Password`.

Never commit credentials, local publish profiles, or generated `bin`, `obj`, and
`publish` output.

# Bella Restaurant

Full-stack restaurant ordering application. The repository contains the React
frontend in `netlify/` and the ASP.NET Core API in `backend/`.

## Requirements

- Node.js 20 and npm
- .NET 8 SDK
- SQL Server for running the API

## Frontend

```bash
cd netlify
npm ci
npm run dev
```

During development, the frontend uses the local API at
`http://127.0.0.1:5080` by default. Start the backend before using features that
load or save data. To use a different API URL, set `VITE_API_URL` in
`netlify/.env.development.local` (this local file is ignored by Git).

Check the frontend before submitting changes:

```bash
npm run lint
npm run build
```

Netlify is configured in the root `netlify.toml` to use `netlify/` as its base
directory, run `npm run build`, and publish `dist/`.

## Backend

The API requires a SQL Server database with the application's schema. The
database and its data are not included in this repository. Configure a local
SQL Server connection and local secrets from the repository root:

```powershell
dotnet user-secrets set "ConnectionStrings:BazaCon" "<SQL Server connection string>" --project .\backend\backend\backend.csproj
dotnet user-secrets set "JwtSettings:SecretKey" "<random secret of at least 32 bytes>" --project .\backend\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Username" "<SMTP username>" --project .\backend\backend\backend.csproj
dotnet user-secrets set "SmtpSettings:Password" "<SMTP password>" --project .\backend\backend\backend.csproj
dotnet run --project .\backend\backend\backend.csproj --no-launch-profile -- --urls http://127.0.0.1:5080
```

The commands above configure credentials on your machine only; do not commit
them. SMTP settings are needed for email-based registration/verification.
The backend must listen on port `5080` for the frontend's default local URL.
When deploying the frontend, set `VITE_API_URL` to the deployed API URL.

For deployment, supply the same values through environment variables:
`ConnectionStrings__BazaCon`, `JwtSettings__SecretKey`,
`SmtpSettings__Username`, and `SmtpSettings__Password`.

The backend Docker build context is `backend/backend`:

```bash
docker build -t bella-backend ./backend/backend
```

Never commit credentials, publish profiles, local environment files, or generated
build output.

## CI

GitHub Actions runs frontend lint/build and a backend .NET build for pushes and
pull requests.

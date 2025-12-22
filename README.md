📘 TolkGuide – Fullstack-applikation
Projektbeskrivning

TolkGuide är en lokal fullstack-applikation utvecklad som en del av Kunskapskontroll 1 – Individuell Fullstack-applikation i kursen Objektorienterad Programmering – Avancerad.

Applikationen gör det möjligt för:

Kunder att registrera sig, logga in och boka tolkar

Tolkar att skapa och uppdatera sin profil samt hantera bokningar

Projektet är byggt för att efterlikna hur en juniorutvecklare arbetar i ett verkligt projekt, med tydlig arkitektur, databasrelationer, tester och versionshantering.

Arkitekturöversikt

Projektet är uppdelat enligt en Clean-ish Architecture med tydlig separation av ansvar:

Backend (.NET API)

API
Controllers och endpoints

Application
DTOs, service-interfaces och affärslogik

Domain
Domänmodeller (User, Customer, Interpreter, Booking, Language)

Infrastructure
Databas (EF Core), services, autentisering och repositories

Databas

SQL Server (lokal)

Entity Framework Core

Relationer:

One-to-many (Customer → Bookings, Interpreter → Bookings)

Many-to-many (Interpreter ↔ Language)

Frontend (React)

React med TypeScript

Rollbaserat flöde (Customer / Interpreter)

API-integration via HTTP-anrop

Loading- och error-states

Startinstruktioner
Förutsättningar

.NET SDK

SQL Server / SSMS

Node.js + npm

Visual Studio / VS Code

Backend

Öppna lösningen i Visual Studio

Kontrollera connection string i appsettings.json

Kör migrationer:

Update-Database


Starta API-projektet (https://localhost:xxxx)

Frontend

Gå till frontend-mappen

Installera beroenden:

npm install


Skapa .env och sätt API-url:

VITE_API_URL=https://localhost:xxxx


Starta frontend:

npm run dev

Endpoints (exempel)
Auth

POST /api/auth/register

POST /api/auth/login

POST /api/auth/refresh

Customers

GET /api/customers/me

PUT /api/customers/me

Interpreters

GET /api/interpreters/public

GET /api/interpreters/me

POST /api/interpreters

PUT /api/interpreters/me

Bookings

POST /api/bookings

GET /api/bookings

PUT /api/bookings/{id}/cancel

Tester

Projektet innehåller enhetstester för:

AuthService

BookingService

Tester körs lokalt och är förberedda för att köras via CI (GitHub Actions).

Kända buggar / begränsningar

Frontend-validering är grundläggande och kan förbättras

UI/UX är funktionellt men inte fullt optimerat

Felmeddelanden från backend kan i vissa fall visas tekniskt i frontend

Förbättringar för framtida version

Pagination och filtrering i frontend

Mer avancerad felhantering

Integrationstester

Förbättrad UI-design

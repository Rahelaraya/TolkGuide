# 📘 TolkGuide – Fullstack-applikation

## Projektbeskrivning
TolkGuide är en lokal fullstack-applikation utvecklad som en del av **Kunskapskontroll 1 – Individuell Fullstack-applikation** i kursen *Objektorienterad Programmering – Avancerad*.

Applikationen är ett bokningssystem för tolktjänster där:
- **Kunder** kan registrera sig, logga in och boka tolkar
- **Tolkar** kan skapa och uppdatera sin profil samt hantera bokningar

Projektet är utvecklat individuellt och följer modern branschpraxis för en junior fullstack-utvecklare.

---

## Arkitekturöversikt

Projektet är uppbyggt enligt en **Clean-ish Architecture** med tydlig ansvarsfördelning.

### Backend (.NET API)
Projektet är uppdelat i flera lager:

- **API**
  - Controllers och endpoints
- **Application**
  - DTOs
  - Service-interfaces
  - Affärslogik
- **Domain**
  - Domänmodeller (User, Customer, Interpreter, Booking, Language)
- **Infrastructure**
  - Entity Framework Core
  - Databaskoppling
  - Services
  - Autentisering

### Databas
- SQL Server (lokal databas)
- Entity Framework Core med migrationer
- Relationer:4. Starta API-projektet

### Frontend
1. Navigera till frontend-mappen
2. Installera beroenden:

  - One-to-many (Customer → Bookings, Interpreter → Bookings)
  - Many-to-many (Interpreter ↔ Language via join-tabell)

### Frontend (React)
- React med TypeScript
- Rollbaserat flöde (Customer / Interpreter)
- API-integration via HTTP-anrop
- Loading- och error states

---

## Startinstruktioner

### Förutsättningar
- .NET SDK
- SQL Server / SSMS
- Node.js och npm
- Visual Studio / VS Code

### Backend
1. Öppna lösningen i Visual Studio
2. Kontrollera connection string i `appsettings.json`
3. Kör migrationer:
 Skapa en `.env`-fil och sätt API-url:
4. Starta frontend:

---

## Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Customers
- `GET /api/customers/me`
- `PUT /api/customers/me`

### Interpreters
- `GET /api/interpreters/public`
- `GET /api/interpreters/me`
- `POST /api/interpreters`
- `PUT /api/interpreters/me`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings`
- `PUT /api/bookings/{id}/cancel`

---

## Tester
Projektet innehåller enhetstester för:
- AuthService
- BookingService

Tester är skrivna för att testa affärslogik och edge cases och är förberedda för att köras via CI.

## CI / GitHub Actions
Projektet använder GitHub Actions för Continuous Integration.
Vid varje pull request körs automatiskt:
- Restore
- Build
- Enhetstester

Detta säkerställer att koden bygger korrekt och att tester passerar innan merge.

---

## Kända buggar / begränsningar
- Frontend-validering är grundläggande
- UI/UX är funktionellt men kan förbättras
- Felmeddelanden från backend kan ibland visas tekniskt i frontend

---

## Sammanfattning
Projektet uppfyller kraven för **Godkänt (G)** enligt kursens kravspecifikation och visar:
- Fullstack-utveckling
- Databasrelationer
- Tydlig arkitektur
- Enhetstester
- Versionshantering med GitHub



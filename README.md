# Clean Architecture .NET Backend Boilerplate

Ett återanvändbart backend-startprojekt byggt med **Clean Architecture i .NET**.  
Projektet innehåller **JWT-autentisering**, **EF Core + SQL** och ett tydligt lagerupplägg för skalbara applikationer.

---

project-structure:
  API:
    - Controllers
    - Requests
    - Responses
    - Dependency Injection
  Application:
    - Use Cases
    - DTOs
    - Services
    - Interfaces
  Domain:
    - Entities
    - Value Objects
    - Domain Rules
  Infrastructure:
    - EF Core
    - SQL
    - Repository Implementations
  Test:
    - Unit Tests (optional)
  Solution:
    - Clean-API.sln

---

## 🧱 Arkitektur

| Lager | Ansvar |
|------|--------|
| **Domain** | Entiteter, logik, regler |
| **Application** | Use cases, DTOs, Services |
| **Infrastructure** | Databas, EF Core, Repositories |
| **API** | Controllers, routing, authentication |

✔ API kommunicerar **aldrig direkt** med databasen  
✔ All logik passerar via **Application-lagret**


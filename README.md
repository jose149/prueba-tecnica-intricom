# Hotel Booking

Technical test for INTRICOM.

Backend and frontend application for managing hotels, clients and hotel bookings, with support for two interchangeable persistence mechanisms:

- SQL Server
- File System

The project is organized as a lightweight monorepo containing the backend API and a React frontend.

---

## 1. Requirements

The application manages the following entities:

- `Hotel`
- `Client`
- `HotelBooking`

Relationships:

- A `Hotel` can have multiple `HotelBooking` records.
- A `Client` can have multiple `HotelBooking` records.
- Each `HotelBooking` belongs to one `Hotel` and one `Client`.

The persistence mechanism can be selected through configuration:

```env
DATA_TYPE=DB
```

or:

```env
DATA_TYPE=FS
```

---

## 2. Technology Stack

### Backend

- TypeScript
- Node.js
- NestJS
- TypeORM
- SQL Server
- `class-validator`
- `class-transformer`

### Frontend

- React
- TypeScript
- Vite

The frontend provides a simple user interface for listing, creating and updating Clients, Hotels and Hotel Bookings through the REST API.

It is intentionally kept lightweight, focusing on the functional requirements of the technical test rather than on visual complexity.

### Persistence

Two implementations are provided:

- SQL Server through TypeORM
- File System through JSON files

---

# 3. Architecture

The project follows a layered architecture combined with the Repository Pattern.

Conceptually:

```text
                  React Frontend
                        │
                        │ HTTP / REST
                        ▼
                  NestJS API
                        │
                        ▼
                   Controllers
                        │
                        ▼
                    Use Cases
                        │
                        ▼
                 Domain Interfaces
                    │          │
                    ▼          ▼
              SQL Server   File System
               / TypeORM
```

The project is organized into two applications:

```text
backend/
frontend/
```

### Backend

The backend is divided into three main layers:

- **Domain**
- **Application**
- **Infrastructure**

### Domain

Contains the application's core models and repository contracts.

```text
backend/src/domain/client/
backend/src/domain/hotel/
backend/src/domain/hotel-booking/
```

The domain defines repository interfaces such as:

```text
ClientRepository
HotelRepository
HotelBookingRepository
```

The domain does not depend on TypeORM, SQL Server or the File System.

### Application

Contains the use cases, DTOs and controllers.

```text
backend/src/application/client/
backend/src/application/hotel/
backend/src/application/hotel-booking/
```

Use cases depend on repository interfaces rather than concrete persistence implementations.

### Infrastructure

Contains the concrete implementations of the repository interfaces.

For SQL Server:

```text
backend/src/infrastructure/database/
```

For File System:

```text
backend/src/infrastructure/filesystem/
```

This allows the persistence implementation to be changed without modifying the application use cases.

---

# 4. Approach and Technical Reasoning

The first consideration was to avoid coupling the application logic to a specific persistence mechanism.

The requirements explicitly allow both database and File System persistence, so implementing the CRUD logic directly against TypeORM or directly against `fs` would make the application unnecessarily difficult to maintain.

For this reason, repository interfaces were defined in the Domain layer and concrete implementations were placed in Infrastructure.

For example:

```text
ClientRepository
       │
       ├── TypeOrmClientRepository
       │
       └── FsClientRepository
```

The use case only knows about `ClientRepository`.

This follows the Dependency Inversion Principle and makes the persistence mechanism replaceable.

## Why NestJS?

NestJS was selected because the requested technology stack is centered around TypeScript and NestJS, and because its dependency injection and modular architecture fit naturally with the chosen design.

It also provides a clear structure for separating controllers, application services/use cases and infrastructure.

## Why TypeORM?

TypeORM was selected as the ORM for SQL Server because it integrates naturally with NestJS and provides a clear mapping between the relational schema and TypeScript entities.

The database schema was respected rather than introducing additional domain fields that were not specified in the requirements.

## Why React?

React was selected for the frontend because it is part of the requested technology stack and provides a straightforward way to build the required CRUD interface.

The frontend was intentionally kept simple to prioritize the backend architecture and persistence requirements while still providing a functional UI.

## Why DTO validation?

Input validation is performed at the API boundary using `class-validator`.

This prevents invalid data from reaching the application layer and provides consistent HTTP validation errors.

The global `ValidationPipe` is configured with:

```typescript
whitelist: true
```

so unexpected properties are removed from incoming requests.

## Referential integrity

When creating or updating a `HotelBooking`, the application verifies that the referenced `Hotel` and `Client` exist.

This is especially important for the File System implementation, where the database foreign-key constraints available in SQL Server do not exist.

SQL Server additionally enforces these relationships through foreign keys.

This provides consistent application behaviour across both persistence mechanisms.

---

# 5. Data Model

The database follows the schema provided for the technical test.

### Hotel

```text
Id
Name
Address
CreatedDate
```

### Client

```text
Id
Name
Address
Phone
CreatedDate
```

### HotelBooking

```text
Id
HotelId
Name
Address
CreatedDate
ClientId
```

Foreign keys:

```text
HotelBooking.HotelId → Hotel.Id
HotelBooking.ClientId → Client.Id
```

The `Name` and `Address` fields in `HotelBooking` have been retained because they are part of the provided schema.

No additional booking-specific fields such as check-in date, check-out date, price or room number have been introduced because they were not part of the specified model.

---

# 6. Persistence

## SQL Server

The application can use SQL Server through TypeORM.

Configuration:

```env
DATA_TYPE=DB

DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=hotelapp
DB_PASSWORD=your_password
DB_DATABASE=HotelBookingDb
```

TypeORM is configured with:

```text
synchronize: false
```

The database schema is therefore treated as an existing schema rather than being automatically modified by the application.

## File System

When:

```env
DATA_TYPE=FS
```

the application uses JSON files as persistence.

The configured directory is specified by:

```env
FS_FOLDER=./data
```

The structure is:

```text
data/
├── Client/
│   ├── _metadata.json
│   ├── 1.json
│   ├── 2.json
│   └── ...
│
├── Hotel/
│   ├── _metadata.json
│   ├── 1.json
│   └── ...
│
└── HotelBooking/
    ├── _metadata.json
    ├── 1.json
    └── ...
```

Each entity has its own metadata file containing:

```json
{
  "TOTAL_REGISTRIES": 0,
  "LAST_INDEX": 0
}
```

Each record is stored in an individual JSON file, making the contents easy to inspect and understand manually.

The `LAST_INDEX` value is used to generate the next identifier.

The `data/` directory is excluded from Git.

---

# 7. API

## Clients

### Get all clients

```http
GET /clients
```

### Create a client

```http
POST /clients
```

Example:

```json
{
  "name": "Juan Pérez",
  "address": "Carrer Major 1",
  "phone": "600123456"
}
```

### Update a client

```http
PATCH /clients/:id
```

Example:

```json
{
  "phone": "699999999"
}
```

---

## Hotels

### Get all hotels

```http
GET /hotels
```

### Create a hotel

```http
POST /hotels
```

Example:

```json
{
  "name": "Hotel Mallorca",
  "address": "Palma"
}
```

### Update a hotel

```http
PATCH /hotels/:id
```

---

## Hotel Bookings

### Get all bookings

```http
GET /hotel-bookings
```

### Create a booking

```http
POST /hotel-bookings
```

Example:

```json
{
  "hotelId": 1,
  "name": "Hotel Mallorca",
  "address": "Palma",
  "clientId": 1
}
```

The API validates that both the referenced hotel and client exist.

### Update a booking

```http
PATCH /hotel-bookings/:id
```

---

# 8. Configuration

Create a `.env` file in the `backend/` directory based on `.env.example`.

Example:

```env
DATA_TYPE=DB
FS_FOLDER=./data

DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=hotelapp
DB_PASSWORD=your_password
DB_DATABASE=HotelBookingDb
```

The `.env` file is intentionally excluded from version control.

---

# 9. Installation

From the project root:

```bash
npm run install:all
```

This installs dependencies for both the backend and frontend.

---

# 10. Running the application

From the project root, start the backend:

```bash
npm run dev:backend
```

In a separate terminal, start the frontend:

```bash
npm run dev:frontend
```

The backend API will be available at:

```text
http://localhost:3000
```

The frontend will be available at the URL provided by Vite, normally:

```text
http://localhost:5173
```

To build both applications:

```bash
npm run build
```

---

# 11. Project Structure

```text
hotel-booking/
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── package.json
└── README.md
```

---

# 12. Validation and Error Handling

The API validates incoming DTOs using `class-validator`.

Examples of validation handled by the API include:

- Required fields
- String fields
- Numeric identifiers
- Non-existent clients
- Non-existent hotels
- Non-existent bookings

For example, attempting to create a booking with an unknown client returns a `400 Bad Request`.

Attempting to update a non-existent record returns `404 Not Found`.

---

# 13. Technical Decisions

### Repository Pattern

Repositories isolate persistence from application logic.

### Dependency Injection

NestJS dependency injection is used to inject repository implementations through explicit repository tokens.

This avoids coupling use cases to concrete infrastructure classes.

### Domain/Application separation

Business/application operations are implemented through use cases rather than placing application logic directly in controllers.

Controllers are therefore kept thin and primarily responsible for HTTP transport concerns.

### Database schema

The supplied relational schema has been respected without adding non-specified fields.

### File System metadata

The metadata file follows the format required by the specification and maintains the total number of records and the last generated identifier.

### Lightweight frontend

The frontend focuses on fulfilling the required CRUD functionality while keeping the implementation simple and easy to understand.

---

# 14. Improvements With More Development Time

The current implementation prioritizes the requirements of the technical test and a clear separation of responsibilities.

With additional development time, I would consider the following improvements.

## Automated testing

Add a more complete automated test suite covering:

- Unit tests for all use cases
- Repository tests
- Controller/e2e tests
- Validation scenarios
- Referential integrity
- Both persistence implementations

The repository interfaces make this particularly straightforward because use cases can be tested against mocked repositories.

## More robust File System persistence

The current File System implementation is intentionally simple and designed to satisfy the requirements.

For a production-oriented implementation I would consider:

- Atomic writes
- Concurrency control
- Recovery from partially written files
- Metadata consistency checks
- Handling simultaneous record creation
- More explicit error types

The current `LAST_INDEX` approach is sufficient for the scope of this technical test but would require additional synchronization in a concurrent environment.

## Transactions

The SQL Server implementation could use transactions for operations that modify multiple resources or require stronger consistency guarantees.

## API documentation

I would add OpenAPI/Swagger documentation describing:

- Endpoints
- Request schemas
- Response schemas
- Validation errors
- HTTP status codes

## Pagination and filtering

For larger datasets, `GET` endpoints should support pagination and possibly filtering and sorting rather than returning every record.

## Better domain modelling

The current domain model deliberately follows the supplied schema.

In a larger production application, I would review the meaning of the duplicated `Name` and `Address` fields in `HotelBooking` and clarify whether they represent booking-time snapshots or duplicated hotel information.

If they are intended as snapshots, that behaviour should be explicitly documented and modelled.

## Frontend improvements

The current frontend provides the required basic CRUD operations for the three entities.

With additional development time, I would improve it with:

- More comprehensive form validation and user feedback
- Loading and error states
- Confirmation feedback after create/update operations
- Better separation into reusable components
- Client-side routing
- Responsive design
- Improved accessibility
- More polished UX for managing Hotel Booking relationships

---

# 15. Conclusion

The solution focuses on providing a maintainable and extensible application while keeping persistence concerns isolated from application logic.

The main architectural decision is the use of repository interfaces combined with separate SQL Server and File System implementations.

The frontend provides a lightweight interface for the three entities, while the backend contains the application and domain logic.

This makes it possible to switch persistence mechanisms through configuration without changing the application use cases.

# AuthSystem

## Overview
AuthSystem is a modular authentication and user management system built with .NET 10. It provides features such as user registration, login, role-based authorization, and real-time notifications using SignalR.

---

## Project Structure

src/
├── AuthSystem.API/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── UsersController.cs
│   ├── DTOs/
│   │   └── AuthDtos.cs
│   ├── Extensions/
│   │   └── ServiceExtensions.cs
│   ├── Hubs/
│   │   └── NotificationHub.cs
│   ├── Middleware/
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.json
├── AuthSystem.Core/
│   ├── Common/
│   │   ├── Constants.cs
│   │   └── Enums.cs
│   ├── Entities/
│   │   └── User.cs
│   ├── Interfaces/
│   │   ├── IUserRepository.cs
│   │   └── IUserService.cs
│   ├── Models/
│   │   └── UserModels.cs
│   └── Services/
│       └── UserService.cs
├── AuthSystem.Infrastructure/
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Identity/
│   │   └── IdentitySeed.cs
│   ├── Repositories/
│   │   └── UserRepository.cs
│   └── DependencyInjection.cs


---
## Features
Workflow Documentation
There is no dedicated workflow documentation file (e.g., WORKFLOW.md, README.md, or similar) present in the file tree. However, the workflow and architecture can be inferred from the code structure:
High-Level Workflow
1.	API Layer (AuthSystem.API)
•	Entry point: Program.cs configures services, middleware, and endpoints.
•	Controllers (AuthController, UsersController) handle HTTP requests for authentication and user management.
•	DTOs define request/response shapes.
•	SignalR hub (NotificationHub) manages real-time notifications.
2.	Core Layer (AuthSystem.Core)
•	Entities (e.g., User) represent domain models.
•	Interfaces (IUserRepository, IUserService) define contracts for data access and business logic.
•	Services (UserService) implement business logic using repositories.
•	Models define data structures for service operations.
3.	Infrastructure Layer (AuthSystem.Infrastructure)
•	Data access via ApplicationDbContext (Entity Framework Core).
•	Repositories (e.g., UserRepository) implement data access logic.
•	Dependency injection setup for infrastructure services.
•	Identity seeding for initial admin/user setup.
Sequence of Processes
•	Startup: Program.cs sets up DI, authentication, CORS, controllers, SignalR, and seeds data.
•	Authentication: AuthController handles login, registration, JWT generation, and user info retrieval.
•	User Management: UsersController provides CRUD operations for users, using IUserService and DTOs.
•	Business Logic: UserService implements user-related operations, interacting with IUserRepository.
•	Data Access: UserRepository communicates with ApplicationDbContext for database operations.
•	Notifications: NotificationHub enables real-time updates (e.g., on user registration).
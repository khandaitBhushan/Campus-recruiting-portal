# Campus Recruiting Portal - Backend Engine

[![Watch the Demo Video](../video_preview.png)](https://drive.google.com/file/d/1pZfu8G3xrySDFKOFGNVWgT60PBL_8UjR/view?usp=sharing)

> 🎥 **Walkthrough Video**: [Click here to watch the full project demonstration on Google Drive](https://drive.google.com/file/d/1pZfu8G3xrySDFKOFGNVWgT60PBL_8UjR/view?usp=sharing)

This folder contains the Java 21 and Spring Boot 4.1 backend engine for the Campus Recruiting Portal. The backend runs as a REST API backed by a MySQL database, providing role-based security via stateless JSON Web Tokens (JWT), transactional recruitment tracking, inline PDF reports, and CSV parsing capabilities.

---

## 🛠 Technology Stack

- **Core Framework**: Spring Boot 4.1
- **Language**: Java 21
- **Database Mapping**: Spring Data JPA + Hibernate
- **Database Engine**: MySQL 8.x
- **Authentication & Security**: Spring Security + JWT (`jjwt` 0.12.5)
- **Reporting Engine**: OpenPDF 2.0.2 (LibrePDF fork)
- **API Documentation**: Springdoc OpenAPI / Swagger UI 2.8.5

---

## 📂 Project Architecture

The codebase follows a standard layered architecture:

```
src/main/java/com/yourorg/crp/
├── CampusRecruitingPortalApplication.java  # Application Entrypoint
├── config/                                # Spring configurations (Security, JWT, Swagger, Seed Data)
├── controller/                            # REST Controllers exposing resource endpoints
├── dto/                                   # Data Transfer Objects for API requests/responses
├── model/                                 # JPA Database Entities
├── repository/                            # Spring Data JPA Repository interfaces
└── service/                               # Core business logic handlers
```

---

## 🛢 Local Setup & Database Integration

### 1. Database Connection
By default, the application is configured to connect to MySQL on `localhost:3306` with the database name `CRM`. Update [application.properties](file:///e:/campus-recruiting-portal/campus-recruiting-portal/backend/src/main/resources/application.properties) if your local MySQL settings differ:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/CRM?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=pass@123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```

*Note: The `createDatabaseIfNotExist=true` parameter automatically creates the schema on the first launch if it does not exist.*

### 2. Compilation and Run
Execute the Maven wrapper tool to clean, build, and run the service locally on port `8080`:

```powershell
# Windows
.\mvnw.cmd clean spring-boot:run

# Linux / macOS
./mvnw clean spring-boot:run
```

The server starts at `http://localhost:8080`.

---

## 🔐 Core System Workings

### 1. JWT Security & Filters
- **Stateless Authentication**: The system uses JWT for authorization. Users supply their email and password at `/api/auth/login` to receive a token.
- **Request Filter**: Every API request passes through [JwtAuthenticationFilter.java](file:///e:/campus-recruiting-portal/campus-recruiting-portal/backend/src/main/java/com/yourorg/crp/config/JwtAuthenticationFilter.java). The filter extracts the JWT from the `Authorization: Bearer <token>` header, validates the signature using [JwtService.java](file:///e:/campus-recruiting-portal/campus-recruiting-portal/backend/src/main/java/com/yourorg/crp/config/JwtService.java), and registers the authentication in Spring's `SecurityContext`.
- **Method Security**: Controllers restrict access depending on the `UserRole` enum (`ADMIN`, `STUDENT`, `COMPANY`).

### 2. File Uploads (Binary Storage)
Resumes and company logos are stored directly inside the MySQL database as binary large objects (`LONGBLOB`) via the `FileAttachment` entity. 
- Files are POSTed to `/api/files/upload` as multipart form-data.
- The service stores the binary array and returns a direct public access link mapping to `/api/files/{id}`.

### 3. Student Bulk Import (CSV)
Administrators can upload student lists in bulk. The CSV format is parsed line-by-line within a transaction:
- **Endpoint**: `/api/admin/students/import`
- **CSV Format Specification**:
  ```csv
  Name,Email,Department,Branch,CGPA,ActiveBacklogs,GraduationYear,Password
  "Rohan Sen","rohan.sen@university.edu","Engineering","CSE",8.52,0,2027,"pass123"
  ```
- **Execution Details**: For each line, the system first registers a global `User` account with role `STUDENT`, encrypts the password, and then creates the corresponding `Student` profile record.

### 4. Dynamic PDF Reports
The Placement Cell uses `/api/admin/reports/placement-pdf` to export PDF statistics. The controller leverages **OpenPDF** to write a clean, structured table representation directly into the HTTP response stream with `application/pdf` headers.

---

## 🔑 Seeding & Default Logins

On startup, [DemoDataInitializer.java](file:///e:/campus-recruiting-portal/campus-recruiting-portal/backend/src/main/java/com/yourorg/crp/config/DemoDataInitializer.java) auto-seeds default credentials if the user table is empty.

| Workspace Role | Seed Email | Password | Status |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@university.edu` | `admin123` | Active |
| **Company** (Approved) | `recruiting@orbit.example` | `password123` | Approved |
| **Company** (Approved) | `talent@prism.example` | `password123` | Approved |
| **Company** (Pending) | `hr@bluefield.example` | `password123` | Pending |
| **Student** | `priya.mehta@university.edu` | `password123` | Unplaced |
| **Student** | `arjun.rao@university.edu` | `password123` | Unplaced |

---

## 📌 Endpoint Catalog & Access Control

For detailed schemas and interactive payloads, view the Swagger UI at `http://localhost:8080/swagger-ui/index.html`.

### Authentication (Public)
- `POST /api/auth/login`: Issue bearer token.
- `POST /api/auth/register/student`: Create student user (restricts email domain to `@university.edu`).
- `POST /api/auth/register/company`: Create company user (creates profile in `PENDING` state).

### Files
- `POST /api/files/upload` (`Authenticated`): Upload multi-part files.
- `GET /api/files/{id}` (`Public`): Stream binary file contents.

### Student Operations
- `GET /api/students/{id}` (`STUDENT`, `ADMIN`): Fetch profile.
- `PUT /api/students/{id}` (`STUDENT`, `ADMIN`): Update academic information and resume URL.
- `GET /api/postings/student` (`STUDENT`): Search all approved job postings.
- `POST /api/applications` (`STUDENT`): Submit job application with cover letter.
- `GET /api/applications/student/{studentId}` (`STUDENT`, `ADMIN`): View submitted applications.

### Company Operations
- `POST /api/postings/company/{companyId}` (`COMPANY`): Post a job. Restricts postings to approved status.
- `GET /api/postings/company/{companyId}` (`COMPANY`, `ADMIN`): View postings list.
- `GET /api/applications/posting/{postingId}` (`COMPANY`, `ADMIN`): View student applications for a posting.
- `PATCH /api/applications/{id}/status` (`COMPANY`, `ADMIN`): Transition applicant states (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).

### Admin Operations
- `PATCH /api/companies/{companyId}/review` (`ADMIN`): Approve/Reject company registrations.
- `PATCH /api/postings/{postingId}/review` (`ADMIN`): Approve/Reject job openings.
- `GET /api/admin/analytics` (`ADMIN`): Retrieve overall placement metrics.
- `POST /api/admin/students/import` (`ADMIN`): Bulk import students via CSV.
- `PUT /api/admin/students/{id}/placement` (`ADMIN`): Explicitly set placement status.
- `GET /api/admin/reports/placement-pdf` (`ADMIN`): Export dynamic PDF report.

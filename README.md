# Hospital Management System

Full-stack Hospital Management System built with **Spring Boot**, **MySQL**, and a **HTML/CSS/JavaScript** frontend.

## Project Structure

```
hospital management/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/          # Java source code
│   └── src/main/resources/     # application.properties
├── database/                   # MySQL schema (schema.sql)
├── Hospital-Management/        # Frontend (HTML, CSS, JS)
│   ├── admin/                  # Admin dashboard pages
│   ├── doctor/                 # Doctor dashboard pages
│   ├── patient/                # Patient dashboard pages
│   ├── css/                    # Stylesheets
│   └── js/                     # JavaScript (includes api.js)
└── start.bat                   # Windows startup script
```

## Prerequisites

- **Java 17** or higher ([Download Eclipse Temurin](https://adoptium.net/))
- **Maven 3.8+** ([Download Maven](https://maven.apache.org/download.cgi))
- **MySQL 8.0+** (running locally)

> **Note:** Java 8 will NOT work. Spring Boot 3.x requires Java 17+.

## Quick Start (Windows)

1. Start MySQL server
2. Update MySQL credentials in `backend/src/main/resources/application.properties` if needed
3. Double-click `start.bat` OR run:

```bash
cd backend
mvn spring-boot:run
```

4. Open **http://localhost:8080** in your browser

## Database Setup

1. Start MySQL server
2. Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

The database `hospital_management` is created automatically on first run.

## How to Run

### 1. Start the Backend (serves frontend + API)

```bash
cd backend
mvn spring-boot:run
```

### 2. Open the Application

Visit: **http://localhost:8080**

The Spring Boot server serves both the frontend and REST API.

## Demo Login Credentials

| Role    | Email              | Password     |
|---------|--------------------|--------------|
| Admin   | admin@hms.com      | Admin@123    |
| Doctor  | doctor@hms.com     | Doctor@123   |
| Patient | patient@hms.com    | Patient@123  |

## API Endpoints

| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| POST   | `/api/auth/login`                     | User login               |
| POST   | `/api/auth/register`                  | Patient registration     |
| GET    | `/api/patients`                       | List all patients        |
| POST   | `/api/patients`                       | Create patient           |
| GET    | `/api/doctors`                        | List all doctors         |
| GET    | `/api/doctors/department/{code}`      | Doctors by department    |
| POST   | `/api/doctors`                        | Create doctor            |
| GET    | `/api/appointments`                   | List all appointments    |
| POST   | `/api/appointments`                   | Book appointment         |
| PATCH  | `/api/appointments/{id}/status`       | Update appointment status|
| GET    | `/api/dashboard/stats`                | Admin dashboard stats    |
| GET    | `/api/departments`                    | List departments         |

## Features

- **Authentication**: Login/register with role-based access (Admin, Doctor, Patient)
- **Patient Portal**: Book appointments, view history, cancel appointments, update profile
- **Doctor Portal**: View today's appointments, mark complete/cancel, view assigned patients
- **Admin Portal**: Manage patients, doctors, appointments with live data from MySQL
- **Appointment Booking**: Department-based doctor selection, time slot availability from database
- **Public Website**: Homepage loads doctors and departments from the API
- **Integrated Stack**: Single Spring Boot server serves both frontend and REST API on port 8080

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, BCrypt
- **Database**: MySQL 8
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Chart.js

## Troubleshooting

- **Cannot connect to server**: Ensure Spring Boot is running on port 8080
- **MySQL connection failed**: Check MySQL is running and credentials in `application.properties`
- **Port 8080 in use**: Change `server.port` in `application.properties`

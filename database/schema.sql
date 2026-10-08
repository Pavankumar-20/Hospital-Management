-- Hospital Management System - MySQL Database Schema
-- Database is auto-created by Spring Boot on first run (see application.properties)
-- Run this script manually if you prefer to set up the database yourself.

CREATE DATABASE IF NOT EXISTS hospital_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hospital_management;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    head VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialty VARCHAR(150),
    department_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_doctor_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    age INT,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    address TEXT,
    date_of_birth DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'OUTPATIENT',
    assigned_doctor_id BIGINT,
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_patient_doctor FOREIGN KEY (assigned_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    symptoms TEXT,
    appointment_type VARCHAR(50) DEFAULT 'Consultation',
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Sample verification queries after first run:
-- SELECT u.email, u.role FROM users u;
-- SELECT d.name, d.code FROM departments d;
-- SELECT COUNT(*) AS total_patients FROM patients;
-- SELECT COUNT(*) AS total_doctors FROM doctors;
-- SELECT a.id, a.appointment_date, a.appointment_time, a.status FROM appointments a;

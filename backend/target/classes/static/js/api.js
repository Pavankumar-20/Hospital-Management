/**
 * Hospital Management System - API Client
 * Connects frontend to Spring Boot backend
 */

const API_BASE = window.location.origin + '/api';

const ApiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Make sure Spring Boot is running on port 8080.');
      }
      throw error;
    }
  },

  // Auth
  login(email, password, role) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  },

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Patients
  getPatients() {
    return this.request('/patients');
  },

  getPatient(id) {
    return this.request(`/patients/${id}`);
  },

  getPatientByUserId(userId) {
    return this.request(`/patients/user/${userId}`);
  },

  createPatient(data) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updatePatient(id, data) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deletePatient(id) {
    return this.request(`/patients/${id}`, { method: 'DELETE' });
  },

  // Doctors
  getDoctors() {
    return this.request('/doctors');
  },

  getDoctorsByDepartment(code) {
    return this.request(`/doctors/department/${code}`);
  },

  getDoctor(id) {
    return this.request(`/doctors/${id}`);
  },

  getDoctorByUserId(userId) {
    return this.request(`/doctors/user/${userId}`);
  },

  createDoctor(data) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteDoctor(id) {
    return this.request(`/doctors/${id}`, { method: 'DELETE' });
  },

  // Appointments
  getAppointments() {
    return this.request('/appointments');
  },

  getAppointmentsByPatient(patientId) {
    return this.request(`/appointments/patient/${patientId}`);
  },

  getAppointmentsByDoctor(doctorId) {
    return this.request(`/appointments/doctor/${doctorId}`);
  },

  getBookedSlots(doctorId, date) {
    return this.request(`/appointments/booked-slots?doctorId=${doctorId}&date=${date}`);
  },

  createAppointment(data) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateAppointmentStatus(id, status) {
    return this.request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteAppointment(id) {
    return this.request(`/appointments/${id}`, { method: 'DELETE' });
  },

  // Dashboard & Departments
  getDashboardStats() {
    return this.request('/dashboard/stats');
  },

  getDepartments() {
    return this.request('/departments');
  },

  async populateDepartmentSelect(selectElement, options = {}) {
    const { placeholder = 'Select Department', allLabel = null } = options;
    if (!selectElement) return [];

    try {
      const response = await this.getDepartments();
      const departments = response.data || [];
      selectElement.innerHTML = allLabel
        ? `<option value="">${allLabel}</option>`
        : `<option value="">${placeholder}</option>`;
      departments.forEach(dept => {
        selectElement.innerHTML += `<option value="${dept.code}">${dept.name}</option>`;
      });
      return departments;
    } catch (error) {
      console.warn('Could not load departments:', error.message);
      return [];
    }
  }
};

// Utility helpers for rendering
const HMSUtils = {
  statusBadgeClass(status) {
    const map = {
      scheduled: 'active',
      completed: 'pending',
      cancelled: 'inactive',
      pending: 'pending',
      admitted: 'active',
      outpatient: 'active',
      discharged: 'pending',
      critical: 'inactive',
      active: 'active'
    };
    return map[status?.toLowerCase()] || 'active';
  },

  formatStatus(status) {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds >= 7200 ? 's' : ''} ago`;
    return `${Math.floor(seconds / 86400)} day${seconds >= 172800 ? 's' : ''} ago`;
  }
};

/**
 * Patient Dashboard Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initProfileForm();
  initAppointmentCancellation();
  loadPatientAppointments();
  loadPatientDashboardStats();
  loadPatientProfile();
  loadPatientPrescriptions();
  loadPatientDashboardUpcoming();
});

async function loadPatientProfile() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getPatient(session.profileId);
    const patient = response.data;
    const nameParts = patient.name.split(' ');
    form.firstName.value = nameParts[0] || '';
    form.lastName.value = nameParts.slice(1).join(' ') || '';
    form.email.value = patient.email || '';
    form.phone.value = patient.phone || '';
    form.dateOfBirth.value = patient.dateOfBirth || '';
    form.bloodGroup.value = patient.bloodGroup || '';
    form.address.value = patient.address || '';
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadPatientPrescriptions() {
  const container = document.getElementById('patientPrescriptions');
  if (!container) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getAppointmentsByPatient(session.profileId);
    const completed = response.data.filter(a => a.status === 'completed');

    if (completed.length === 0) {
      container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No prescriptions yet. Prescriptions appear after completed appointments.</td></tr>';
      return;
    }

    container.innerHTML = completed.map(a => `
      <tr>
        <td>${a.doctorName}</td>
        <td>${a.department}</td>
        <td>${HMSUtils.formatDate(a.date)}</td>
        <td>As prescribed by doctor</td>
        <td><span class="status-badge active">Active</span></td>
        <td><button class="table-action-btn view" onclick="downloadPrescription(${a.id})" title="Download"><i class="fas fa-download"></i></button></td>
      </tr>
    `).join('');
  } catch (error) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center;">${error.message}</td></tr>`;
  }
}

async function loadPatientDashboardUpcoming() {
  if (!window.location.pathname.includes('patient/dashboard')) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getAppointmentsByPatient(session.profileId);
    const upcoming = response.data.filter(a => a.status === 'scheduled').slice(0, 2);
    const container = document.querySelector('.appointment-cards');
    if (!container) return;

    if (upcoming.length === 0) {
      container.innerHTML = '<p class="text-muted">No upcoming appointments. <a href="book-appointment.html">Book one now</a></p>';
      return;
    }

    container.innerHTML = upcoming.map(a => {
      const [time, ampm] = a.time.split(' ');
      const [hour, min] = time.split(':');
      return `
        <div class="appointment-card" data-id="${a.id}">
          <div class="appointment-time"><h5>${hour}:${min}</h5><span>${ampm || ''}</span></div>
          <div class="appointment-details">
            <h5>${a.doctorName}</h5>
            <p><i class="fas fa-building"></i> ${a.department} &nbsp;|&nbsp; <i class="fas fa-calendar"></i> ${HMSUtils.formatDate(a.date)}</p>
          </div>
          <span class="status-badge scheduled">Scheduled</span>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.warn('Could not load upcoming appointments:', error.message);
  }
}

async function loadPatientDashboardStats() {
  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getAppointmentsByPatient(session.profileId);
    const appointments = response.data;

    const statCards = document.querySelectorAll('.stats-cards .stat-card-content h3');
    if (statCards.length >= 2) {
      const upcoming = appointments.filter(a => a.status === 'scheduled').length;
      statCards[0].textContent = upcoming;
      statCards[1].textContent = appointments.length;
    }

    const tbody = document.getElementById('patientAppointments');
    if (tbody && appointments.length > 0) {
      renderPatientAppointments(tbody, appointments);
    }
  } catch (error) {
    console.warn('Could not load patient stats:', error.message);
  }
}

function initProfileForm() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!Validator.validateForm(form, {
      firstName: ['required'],
      lastName: ['required'],
      email: ['required', 'email'],
      phone: ['required', 'phone'],
      dateOfBirth: ['required', 'date'],
      address: ['required']
    })) return;

    const session = AuthManager.getSession();
    if (!session?.profileId) {
      showToast('Session expired. Please login again.', 'error');
      return;
    }

    try {
      await ApiClient.updatePatient(session.profileId, {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        dateOfBirth: form.dateOfBirth.value,
        address: form.address.value
      });
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

function initAppointmentCancellation() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.cancel-my-appointment');
    if (!btn) return;

    const row = btn.closest('tr') || btn.closest('.appointment-card');
    const appointmentId = row?.dataset?.id;
    if (!appointmentId) return;

    confirmDelete('this appointment', async () => {
      try {
        await ApiClient.updateAppointmentStatus(appointmentId, 'cancelled');
        const badge = row?.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge cancelled';
          badge.textContent = 'Cancelled';
        }
        showToast('Appointment cancelled successfully', 'success');
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  });
}

async function loadPatientAppointments() {
  const container = document.getElementById('patientAppointments');
  if (!container) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getAppointmentsByPatient(session.profileId);
    renderPatientAppointments(container, response.data);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderPatientAppointments(container, appointments) {
  container.innerHTML = '';

  if (appointments.length === 0) {
    container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No appointments found. <a href="book-appointment.html">Book one now</a></td></tr>';
    return;
  }

  appointments.forEach(apt => {
    const row = document.createElement('tr');
    row.dataset.id = apt.id;
    row.innerHTML = `
      <td data-label="Doctor">${apt.doctorName}</td>
      <td data-label="Department">${apt.department}</td>
      <td data-label="Date">${HMSUtils.formatDate(apt.date)}</td>
      <td data-label="Time">${apt.time}</td>
      <td data-label="Status"><span class="status-badge ${apt.status}">${HMSUtils.formatStatus(apt.status)}</span></td>
      <td data-label="Actions">
        <div class="table-action-btns">
          ${apt.status === 'scheduled' ? '<button class="table-action-btn delete cancel-my-appointment" title="Cancel"><i class="fas fa-times"></i></button>' : ''}
        </div>
      </td>
    `;
    container.appendChild(row);
  });
}

function downloadPrescription(id) {
  showToast('Downloading prescription...', 'success');
  setTimeout(() => showToast('Prescription downloaded!', 'success'), 1500);
}

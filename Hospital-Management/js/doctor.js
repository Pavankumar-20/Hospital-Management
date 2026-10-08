/**
 * Doctor Dashboard Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initPrescriptionForm();
  initAppointmentActions();
  initScheduleManagement();
  loadDoctorAppointments();
  loadDoctorDashboardStats();
  loadDoctorPatients();
  loadDoctorProfile();
});

async function loadDoctorDashboardStats() {
  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getAppointmentsByDoctor(session.profileId);
    const appointments = response.data;
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === today);

    const statCards = document.querySelectorAll('.stats-cards .stat-card-content h3');
    if (statCards.length >= 3) {
      statCards[0].textContent = todayAppts.length;
      statCards[1].textContent = todayAppts.filter(a => a.status === 'completed').length;
      statCards[2].textContent = todayAppts.filter(a => a.status === 'scheduled').length;
    }

    renderDoctorTodayAppointments(todayAppts);
  } catch (error) {
    console.warn('Could not load doctor stats:', error.message);
  }
}

function renderDoctorTodayAppointments(appointments) {
  const container = document.querySelector('.appointment-cards');
  if (!container || appointments.length === 0) return;

  container.innerHTML = appointments.slice(0, 5).map(a => {
    const [time, ampm] = a.time.split(' ');
    const [hour, min] = time.split(':');
    return `
      <div class="appointment-card" data-id="${a.id}">
        <div class="appointment-time"><h5>${hour}:${min}</h5><span>${ampm || ''}</span></div>
        <div class="table-user-avatar" style="width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0;">
          <img src="${a.patientAvatar}" alt="" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div class="appointment-details">
          <h5>${a.patientName}</h5>
          <span>${a.symptoms || a.type || 'Consultation'}</span>
        </div>
        <span class="status-badge ${a.status}">${HMSUtils.formatStatus(a.status)}</span>
        ${a.status === 'scheduled' ? `<button class="btn btn-sm btn-primary complete-appointment" data-id="${a.id}">Complete</button>` : ''}
      </div>
    `;
  }).join('');
}

async function loadDoctorPatients() {
  const container = document.getElementById('doctorPatients');
  if (!container) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const [appointmentsRes, patientsRes] = await Promise.all([
      ApiClient.getAppointmentsByDoctor(session.profileId),
      ApiClient.getPatients()
    ]);

    const appointments = appointmentsRes.data;
    const patientIds = [...new Set(appointments.map(a => a.patientId))];
    const patients = patientsRes.data.filter(p => patientIds.includes(p.id));

    document.getElementById('doctorPatientsTitle').textContent = `Patients (${patients.length})`;

    if (patients.length === 0) {
      container.innerHTML = '<tr><td colspan="6" style="text-align:center;">No patients yet</td></tr>';
      return;
    }

    container.innerHTML = patients.map(p => {
      const lastAppt = appointments.filter(a => a.patientId === p.id).sort((a, b) => b.date.localeCompare(a.date))[0];
      return `
        <tr>
          <td><div class="table-user"><div class="table-user-avatar"><img src="${p.avatarUrl}" alt=""></div><div class="table-user-info"><h5>${p.name}</h5><span>${p.email}</span></div></div></td>
          <td>${p.patientCode}</td>
          <td>${p.age || '-'} / ${p.gender || '-'}</td>
          <td>${p.bloodGroup || '-'}</td>
          <td>${lastAppt ? HMSUtils.formatDate(lastAppt.date) : '-'}</td>
          <td><span class="status-badge ${HMSUtils.statusBadgeClass(p.status)}">${HMSUtils.formatStatus(p.status)}</span></td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `<tr><td colspan="6" style="text-align:center;">${error.message}</td></tr>`;
  }
}

async function loadDoctorProfile() {
  const container = document.getElementById('doctorProfileInfo');
  if (!container) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getDoctor(session.profileId);
    const doctor = response.data;
    container.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-control" value="${doctor.name}" readonly></div>
        <div class="form-group"><label class="form-label">Specialty</label><input type="text" class="form-control" value="${doctor.specialty || ''}" readonly></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-control" value="${doctor.email}" readonly></div>
        <div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-control" value="${doctor.phone || ''}" readonly></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Department</label><input type="text" class="form-control" value="${doctor.department || ''}" readonly></div>
        <div class="form-group"><label class="form-label">Status</label><input type="text" class="form-control" value="${HMSUtils.formatStatus(doctor.status)}" readonly></div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p>${error.message}</p>`;
  }
}

async function loadDoctorAppointments() {
  const table = document.querySelector('.data-table tbody');
  if (!table || !window.location.pathname.includes('doctor/')) return;
  if (!window.location.pathname.includes('appointments')) return;

  const session = AuthManager.getSession();
  if (!session?.profileId) return;

  try {
    const response = await ApiClient.getAppointmentsByDoctor(session.profileId);
    const appointments = response.data;

    table.innerHTML = appointments.map(a => `
      <tr data-id="${a.id}">
        <td>${a.patientName}</td>
        <td>${HMSUtils.formatDate(a.date)}</td>
        <td>${a.time}</td>
        <td>${a.symptoms || '-'}</td>
        <td><span class="status-badge ${a.status}">${HMSUtils.formatStatus(a.status)}</span></td>
        <td>
          <div class="table-action-btns">
            ${a.status === 'scheduled' ? `
              <button class="table-action-btn complete-appointment" data-id="${a.id}" title="Complete"><i class="fas fa-check"></i></button>
              <button class="table-action-btn cancel-appointment" data-id="${a.id}" title="Cancel"><i class="fas fa-times"></i></button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function initPrescriptionForm() {
  const form = document.getElementById('prescriptionForm');
  if (!form) return;

  let medicineCount = 1;

  document.getElementById('addMedicine')?.addEventListener('click', () => {
    medicineCount++;
    const container = document.getElementById('medicinesContainer');
    const row = document.createElement('div');
    row.className = 'form-row medicine-row';
    row.innerHTML = `
      <div class="form-group">
        <label class="form-label">Medicine Name</label>
        <input type="text" class="form-control" name="medicine${medicineCount}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Dosage</label>
        <input type="text" class="form-control" name="dosage${medicineCount}" placeholder="e.g., 1 tablet twice daily" required>
      </div>
      <div class="form-group">
        <label class="form-label">Duration</label>
        <input type="text" class="form-control" name="duration${medicineCount}" placeholder="e.g., 7 days" required>
      </div>
    `;
    container.appendChild(row);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Prescription saved successfully!', 'success');
    form.reset();
    document.getElementById('prescriptionModal')?.classList.remove('active');
  });
}

function initAppointmentActions() {
  document.addEventListener('click', async (e) => {
    const completeBtn = e.target.closest('.complete-appointment');
    const cancelBtn = e.target.closest('.cancel-appointment');

    if (completeBtn) {
      const id = completeBtn.dataset.id;
      try {
        await ApiClient.updateAppointmentStatus(id, 'completed');
        const row = completeBtn.closest('tr') || completeBtn.closest('.appointment-card');
        const badge = row?.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge completed';
          badge.textContent = 'Completed';
        }
        completeBtn.remove();
        showToast('Appointment marked as completed', 'success');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }

    if (cancelBtn) {
      const id = cancelBtn.dataset.id;
      if (!confirm('Cancel this appointment?')) return;
      try {
        await ApiClient.updateAppointmentStatus(id, 'cancelled');
        const row = cancelBtn.closest('tr') || cancelBtn.closest('.appointment-card');
        const badge = row?.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge cancelled';
          badge.textContent = 'Cancelled';
        }
        showToast('Appointment cancelled', 'warning');
      } catch (error) {
        showToast(error.message, 'error');
      }
    }
  });
}

function initScheduleManagement() {
  document.querySelectorAll('.schedule-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      slot.classList.toggle('selected');
    });
  });

  const saveScheduleBtn = document.getElementById('saveSchedule');
  saveScheduleBtn?.addEventListener('click', () => {
    showToast('Schedule updated successfully!', 'success');
  });
}

function viewPatientHistory(patientId) {
  showToast(`Loading medical history for patient #${patientId}...`, 'success');
}

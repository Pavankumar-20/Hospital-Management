/**
 * Admin Dashboard Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminCharts();
  initAdminForms();
  initReportGeneration();
  loadAdminDashboardStats();
  loadDoctorsTable();
  loadPatientsTable();
  loadAppointmentsTable();
  loadDepartmentsTable();
  loadReportsPage();
  populateAdminDepartmentSelects();
});

async function populateAdminDepartmentSelects() {
  const selects = document.querySelectorAll('select[name="department"]');
  for (const select of selects) {
    await ApiClient.populateDepartmentSelect(select);
  }
}

async function loadAdminDashboardStats() {
  const statCards = document.querySelectorAll('.stats-cards .stat-card-content h3');
  if (statCards.length === 0) return;

  try {
    const response = await ApiClient.getDashboardStats();
    const stats = response.data;

    const values = [
      stats.totalPatients,
      stats.totalDoctors,
      stats.todayAppointments,
      stats.completedAppointments || stats.scheduledAppointments
    ];

    statCards.forEach((el, index) => {
      if (values[index] !== undefined) {
        el.textContent = values[index].toLocaleString();
      }
    });

    updateAdminCharts(stats);
    renderRecentActivities(stats.recentActivities);
  } catch (error) {
    console.warn('Could not load dashboard stats:', error.message);
  }
}

function renderRecentActivities(activities) {
  const container = document.querySelector('.activity-list');
  if (!container || !activities || activities.length === 0) return;

  const iconMap = {
    blue: 'fa-calendar-check',
    green: 'fa-check-circle',
    orange: 'fa-times-circle'
  };

  container.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon ${activity.iconType}"><i class="fas ${iconMap[activity.iconType] || 'fa-info-circle'}"></i></div>
      <div class="activity-content">
        <h5>${activity.title}</h5>
        <p>${activity.description}</p>
      </div>
      <span class="activity-time">${HMSUtils.timeAgo(activity.createdAt)}</span>
    </div>
  `).join('');
}

function updateAdminCharts(stats) {
  if (typeof Chart === 'undefined') return;

  const deptCtx = document.getElementById('departmentChart');
  if (deptCtx && stats.doctorsByDepartment) {
    const labels = Object.keys(stats.doctorsByDepartment);
    const data = Object.values(stats.doctorsByDepartment);
    if (deptCtx.chartInstance) {
      deptCtx.chartInstance.data.labels = labels;
      deptCtx.chartInstance.data.datasets[0].data = data;
      deptCtx.chartInstance.update();
    }
  }

  const statusCtx = document.getElementById('appointmentStatusChart');
  if (statusCtx && stats.appointmentsByStatus) {
    const labels = Object.keys(stats.appointmentsByStatus).map(s => HMSUtils.formatStatus(s));
    const data = Object.values(stats.appointmentsByStatus);
    if (statusCtx.chartInstance) {
      statusCtx.chartInstance.data.labels = labels;
      statusCtx.chartInstance.data.datasets[0].data = data;
      statusCtx.chartInstance.update();
    }
  }
}

function initAdminCharts() {
  if (typeof Chart === 'undefined') return;

  const patientCtx = document.getElementById('patientChart');
  if (patientCtx) {
    patientCtx.chartInstance = new Chart(patientCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'New Patients',
          data: [65, 78, 90, 85, 99, 110, 125],
          borderColor: '#0ea5e9',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          fill: true,
          tension: 0.4
        }, {
          label: 'Appointments',
          data: [120, 135, 150, 140, 165, 180, 195],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  const deptCtx = document.getElementById('departmentChart');
  if (deptCtx) {
    deptCtx.chartInstance = new Chart(deptCtx, {
      type: 'doughnut',
      data: {
        labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General'],
        datasets: [{
          data: [25, 18, 22, 15, 10, 10],
          backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } }
      }
    });
  }

  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [45000, 52000, 48000, 61000, 55000, 67000],
          backgroundColor: 'rgba(14, 165, 233, 0.8)',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  const statusCtx = document.getElementById('appointmentStatusChart');
  if (statusCtx) {
    statusCtx.chartInstance = new Chart(statusCtx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Scheduled', 'Cancelled', 'Pending'],
        datasets: [{
          data: [45, 30, 10, 15],
          backgroundColor: ['#10b981', '#0ea5e9', '#ef4444', '#f59e0b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

function initAdminForms() {
  const addDoctorForm = document.getElementById('addDoctorForm');
  if (addDoctorForm) {
    addDoctorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validator.validateForm(addDoctorForm, {
        name: ['required'],
        email: ['required', 'email'],
        phone: ['required', 'phone'],
        specialty: ['required'],
        department: ['required']
      })) return;

      try {
        await ApiClient.createDoctor({
          name: addDoctorForm.name.value,
          email: addDoctorForm.email.value,
          phone: addDoctorForm.phone.value,
          specialty: addDoctorForm.specialty.value,
          department: addDoctorForm.department.value
        });
        showToast('Doctor added successfully!', 'success');
        addDoctorForm.reset();
        document.getElementById('addDoctorModal')?.classList.remove('active');
        loadDoctorsTable();
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }

  const addPatientForm = document.getElementById('addPatientForm');
  if (addPatientForm) {
    addPatientForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validator.validateForm(addPatientForm, {
        name: ['required'],
        email: ['required', 'email'],
        phone: ['required', 'phone'],
        age: ['required', 'positiveNumber'],
        gender: ['required']
      })) return;

      try {
        await ApiClient.createPatient({
          name: addPatientForm.name.value,
          email: addPatientForm.email.value,
          phone: addPatientForm.phone.value,
          age: parseInt(addPatientForm.age.value, 10),
          gender: addPatientForm.gender.value,
          bloodGroup: addPatientForm.bloodGroup?.value || 'O+',
          status: addPatientForm.status?.value || 'OUTPATIENT'
        });
        showToast('Patient added successfully!', 'success');
        addPatientForm.reset();
        document.getElementById('addPatientModal')?.classList.remove('active');
        loadPatientsTable();
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }

  const addAppointmentForm = document.getElementById('addAppointmentForm');
  if (addAppointmentForm) {
    populateAppointmentFormSelects(addAppointmentForm);

    addAppointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const timeValue = addAppointmentForm.time.value;
      const formattedTime = formatTimeForSlot(timeValue);

      try {
        await ApiClient.createAppointment({
          patientId: parseInt(addAppointmentForm.patient.value, 10),
          doctorId: parseInt(addAppointmentForm.doctor.value, 10),
          department: addAppointmentForm.department.value,
          date: addAppointmentForm.date.value,
          time: formattedTime,
          type: addAppointmentForm.type.value,
          notes: addAppointmentForm.notes?.value || ''
        });
        showToast('Appointment scheduled successfully!', 'success');
        addAppointmentForm.reset();
        document.getElementById('addAppointmentModal')?.classList.remove('active');
        loadAppointmentsTable();
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  }
}

async function populateAppointmentFormSelects(form) {
  const patientSelect = form.querySelector('[name="patient"]');
  const doctorSelect = form.querySelector('[name="doctor"]');
  if (!patientSelect || !doctorSelect) return;

  try {
    const [patientsRes, doctorsRes] = await Promise.all([
      ApiClient.getPatients(),
      ApiClient.getDoctors()
    ]);

    patientSelect.innerHTML = '<option value="">Select Patient</option>';
    patientsRes.data.forEach(p => {
      patientSelect.innerHTML += `<option value="${p.id}">${p.name} (${p.patientCode})</option>`;
    });

    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    doctorsRes.data.forEach(d => {
      doctorSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
  } catch (error) {
    console.warn('Could not populate appointment form:', error.message);
  }
}

function formatTimeForSlot(time24) {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;
}

function initReportGeneration() {
  document.querySelectorAll('.generate-report').forEach(btn => {
    btn.addEventListener('click', () => {
      const reportType = btn.dataset.report;
      showToast(`Generating ${reportType} report...`, 'success');
      setTimeout(() => {
        showToast(`${reportType} report downloaded successfully!`, 'success');
      }, 2000);
    });
  });
}

async function loadDoctorsTable() {
  const table = document.querySelector('.data-table');
  if (!table || !window.location.pathname.includes('doctors.html')) return;

  const tbody = table.querySelector('tbody');
  const headerTitle = document.querySelector('.table-header h3');
  if (!tbody) return;

  try {
    const response = await ApiClient.getDoctors();
    const doctors = response.data;

    if (headerTitle) headerTitle.textContent = `All Doctors (${doctors.length})`;

    tbody.innerHTML = doctors.map(doc => `
      <tr data-id="${doc.id}">
        <td><div class="table-user"><div class="table-user-avatar"><img src="${doc.avatarUrl}" alt=""></div><div class="table-user-info"><h5>${doc.name}</h5><span>${doc.email}</span></div></div></td>
        <td>${doc.specialty}</td>
        <td>${doc.department || '-'}</td>
        <td>${doc.phone || '-'}</td>
        <td><span class="status-badge ${HMSUtils.statusBadgeClass(doc.status)}">${HMSUtils.formatStatus(doc.status)}</span></td>
        <td><div class="table-action-btns">
          <button class="table-action-btn delete" data-delete-doctor="${doc.id}" title="Delete"><i class="fas fa-trash"></i></button>
        </div></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-delete-doctor]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.deleteDoctor;
        if (!confirm('Delete this doctor?')) return;
        try {
          await ApiClient.deleteDoctor(id);
          showToast('Doctor deleted', 'success');
          loadDoctorsTable();
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadPatientsTable() {
  const table = document.querySelector('.data-table');
  if (!table || !window.location.pathname.includes('patients.html')) return;

  const tbody = table.querySelector('tbody');
  const headerTitle = document.querySelector('.table-header h3');
  if (!tbody) return;

  try {
    const response = await ApiClient.getPatients();
    const patients = response.data;

    if (headerTitle) headerTitle.textContent = `All Patients (${patients.length})`;

    tbody.innerHTML = patients.map(p => `
      <tr data-id="${p.id}">
        <td><div class="table-user"><div class="table-user-avatar"><img src="${p.avatarUrl}" alt=""></div><div class="table-user-info"><h5>${p.name}</h5><span>${p.email}</span></div></div></td>
        <td>${p.patientCode}</td>
        <td>${p.age || '-'} / ${p.gender || '-'}</td>
        <td>${p.bloodGroup || '-'}</td>
        <td>${p.assignedDoctorName || 'Unassigned'}</td>
        <td>${p.phone || '-'}</td>
        <td><span class="status-badge ${HMSUtils.statusBadgeClass(p.status)}">${HMSUtils.formatStatus(p.status)}</span></td>
        <td><div class="table-action-btns">
          <button class="table-action-btn delete" data-delete-patient="${p.id}" title="Delete"><i class="fas fa-trash"></i></button>
        </div></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-delete-patient]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.deletePatient;
        if (!confirm('Delete this patient?')) return;
        try {
          await ApiClient.deletePatient(id);
          showToast('Patient deleted', 'success');
          loadPatientsTable();
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadDepartmentsTable() {
  const tbody = document.getElementById('departmentsTable');
  if (!tbody) return;

  try {
    const response = await ApiClient.getDepartments();
    const departments = response.data;
    document.getElementById('departmentsTitle').textContent = `All Departments (${departments.length})`;

    tbody.innerHTML = departments.map(d => `
      <tr>
        <td><strong>${d.name}</strong></td>
        <td><code>${d.code}</code></td>
        <td>${d.head || '-'}</td>
        <td>${d.description || '-'}</td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">${error.message}</td></tr>`;
  }
}

async function loadReportsPage() {
  const statsContainer = document.getElementById('reportStats');
  if (!statsContainer) return;

  try {
    const response = await ApiClient.getDashboardStats();
    const stats = response.data;
    const cards = statsContainer.querySelectorAll('.stat-card-content h3');
    const values = [stats.totalPatients, stats.totalDoctors, stats.todayAppointments, stats.completedAppointments];
    cards.forEach((el, i) => { if (values[i] !== undefined) el.textContent = values[i].toLocaleString(); });

    const ctx = document.getElementById('reportStatusChart');
    if (ctx && typeof Chart !== 'undefined' && stats.appointmentsByStatus) {
      const statusData = stats.appointmentsByStatus;
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusData).map(s => HMSUtils.formatStatus(s)),
          datasets: [{
            data: Object.values(statusData),
            backgroundColor: ['#10b981', '#0ea5e9', '#ef4444', '#f59e0b']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  } catch (error) {
    console.warn('Could not load reports:', error.message);
  }
}

async function loadAppointmentsTable() {
  const table = document.querySelector('.data-table');
  if (!table || !window.location.pathname.includes('appointments.html')) return;

  const tbody = table.querySelector('tbody');
  const headerTitle = document.querySelector('.table-header h3');
  if (!tbody) return;

  try {
    const response = await ApiClient.getAppointments();
    const appointments = response.data;

    if (headerTitle) headerTitle.textContent = `All Appointments (${appointments.length})`;

    tbody.innerHTML = appointments.map(a => `
      <tr data-id="${a.id}">
        <td>${a.appointmentCode}</td>
        <td><div class="table-user"><div class="table-user-avatar"><img src="${a.patientAvatar}" alt=""></div><div class="table-user-info"><h5>${a.patientName}</h5><span>${a.patientCode}</span></div></div></td>
        <td>${a.doctorName}</td>
        <td>${a.department}</td>
        <td>${HMSUtils.formatDate(a.date)}</td>
        <td>${a.time}</td>
        <td>${a.type || 'Consultation'}</td>
        <td><span class="status-badge ${HMSUtils.statusBadgeClass(a.status)}">${HMSUtils.formatStatus(a.status)}</span></td>
        <td><div class="table-action-btns">
          <button class="table-action-btn edit" data-complete="${a.id}" title="Complete"><i class="fas fa-check"></i></button>
          <button class="table-action-btn delete" data-cancel="${a.id}" title="Cancel"><i class="fas fa-times"></i></button>
        </div></td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-complete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await ApiClient.updateAppointmentStatus(btn.dataset.complete, 'completed');
          showToast('Appointment marked completed', 'success');
          loadAppointmentsTable();
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });

    tbody.querySelectorAll('[data-cancel]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Cancel this appointment?')) return;
        try {
          await ApiClient.updateAppointmentStatus(btn.dataset.cancel, 'cancelled');
          showToast('Appointment cancelled', 'success');
          loadAppointmentsTable();
        } catch (error) {
          showToast(error.message, 'error');
        }
      });
    });
  } catch (error) {
    showToast(error.message, 'error');
  }
}

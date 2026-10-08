/**
 * Appointment Booking Functionality
 */

const AppointmentManager = {
  timeSlots: [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ],

  init() {
    this.loadDepartments();
    this.initDepartmentChange();
    this.initDatePicker();
    this.initTimeSlots();
    this.initBookingForm();
  },

  async loadDepartments() {
    const deptSelect = document.getElementById('department');
    if (deptSelect) {
      await ApiClient.populateDepartmentSelect(deptSelect);
    }
  },

  initDepartmentChange() {
    const deptSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    if (!deptSelect || !doctorSelect) return;

    deptSelect.addEventListener('change', async () => {
      const dept = deptSelect.value;
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';

      if (!dept) {
        doctorSelect.disabled = true;
        return;
      }

      try {
        const response = await ApiClient.getDoctorsByDepartment(dept);
        const doctors = response.data;
        doctorSelect.disabled = false;

        doctors.forEach(doc => {
          doctorSelect.innerHTML += `<option value="${doc.id}">${doc.name} - ${doc.specialty}</option>`;
        });

        if (doctors.length === 0) {
          showToast('No doctors available in this department', 'warning');
        }
      } catch (error) {
        showToast(error.message, 'error');
        doctorSelect.disabled = true;
      }

      this.renderTimeSlots();
    });

    doctorSelect.addEventListener('change', () => this.renderTimeSlots());
  },

  initDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];

    dateInput.addEventListener('change', () => this.renderTimeSlots());
  },

  initTimeSlots() {
    this.renderTimeSlots();
  },

  async renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    if (!container) return;

    const dateInput = document.getElementById('appointmentDate');
    const doctorSelect = document.getElementById('doctor');
    const selectedDate = dateInput?.value;
    const doctorId = doctorSelect?.value;

    container.innerHTML = '';

    if (!selectedDate) {
      container.innerHTML = '<p class="text-muted">Please select a date first</p>';
      return;
    }

    const dayOfWeek = new Date(selectedDate).getDay();
    if (dayOfWeek === 0) {
      container.innerHTML = '<p class="text-muted">No appointments available on Sundays</p>';
      return;
    }

    if (!doctorId) {
      container.innerHTML = '<p class="text-muted">Please select a doctor first</p>';
      return;
    }

    let bookedSlots = [];
    try {
      const response = await ApiClient.getBookedSlots(doctorId, selectedDate);
      bookedSlots = response.data || [];
    } catch (error) {
      showToast(error.message, 'error');
    }

    this.timeSlots.forEach(slot => {
      const isBooked = bookedSlots.includes(slot);
      const slotEl = document.createElement('div');
      slotEl.className = `time-slot ${isBooked ? 'disabled' : ''}`;
      slotEl.textContent = slot;

      if (!isBooked) {
        slotEl.addEventListener('click', () => {
          container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
          slotEl.classList.add('selected');
          document.getElementById('selectedTime').value = slot;
        });
      }

      container.appendChild(slotEl);
    });
  },

  initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isValid = Validator.validateForm(form, {
        department: ['required'],
        doctor: ['required'],
        appointmentDate: ['required', 'date', 'futureDate'],
        symptoms: ['required', { name: 'minLength', param: 10 }]
      });

      const selectedTime = document.getElementById('selectedTime')?.value;
      if (!selectedTime) {
        showToast('Please select a time slot', 'error');
        return;
      }

      if (!isValid) return;

      const session = AuthManager.getSession();
      if (!session || !session.profileId) {
        showToast('Please login as a patient to book appointments', 'error');
        return;
      }

      try {
        const response = await ApiClient.createAppointment({
          patientId: session.profileId,
          doctorId: parseInt(form.doctor.value, 10),
          department: form.department.value,
          date: form.appointmentDate.value,
          time: selectedTime,
          symptoms: form.symptoms.value,
          type: 'Consultation'
        });

        this.showSuccessModal(response.data);
        form.reset();
        document.getElementById('selectedTime').value = '';
        document.getElementById('doctor').disabled = true;
        this.renderTimeSlots();
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  },

  showSuccessModal(appointment) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-body auth-success">
          <div class="auth-success-icon"><i class="fas fa-check"></i></div>
          <h3>Appointment Booked!</h3>
          <p>Your appointment with <strong>${appointment.doctorName}</strong> has been scheduled for <strong>${HMSUtils.formatDate(appointment.date)}</strong> at <strong>${appointment.time}</strong>.</p>
          <p>Reference: <strong>${appointment.appointmentCode}</strong></p>
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Done</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    showToast('Appointment booked successfully!', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => AppointmentManager.init());

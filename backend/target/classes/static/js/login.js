/**
 * Login & Authentication JavaScript
 */

const AuthManager = {
  demoUsers: {
    patient: { email: 'patient@hms.com', password: 'Patient@123', role: 'patient', name: 'John Doe' },
    doctor: { email: 'doctor@hms.com', password: 'Doctor@123', role: 'doctor', name: 'Dr. Sarah Wilson' },
    admin: { email: 'admin@hms.com', password: 'Admin@123', role: 'admin', name: 'Admin User' }
  },

  init() {
    this.initLoginForm();
    this.initRegisterForm();
    this.initPasswordToggle();
    this.initRoleTabs();
    this.checkAuth();
  },

  initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const fieldRules = {
      email: ['required', 'email'],
      password: ['required', { name: 'minLength', param: 6 }]
    };

    Validator.bindLiveValidation(form, fieldRules);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validator.validateForm(form, fieldRules)) return;

      const email = form.email.value.trim();
      const password = form.password.value;
      const role = form.querySelector('[name="role"]')?.value || this.getActiveRole();
      const remember = form.querySelector('#rememberMe')?.checked;

      await this.login(email, password, role, remember);
    });
  },

  initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const fieldRules = {
      firstName: ['required', { name: 'minLength', param: 2 }],
      lastName: ['required', { name: 'minLength', param: 2 }],
      email: ['required', 'email'],
      phone: ['required', 'phone'],
      password: ['required', 'password'],
      confirmPassword: ['required', { name: 'match', param: null }],
      terms: ['required']
    };

    form.addEventListener('input', () => {
      fieldRules.confirmPassword[1].param = form.password.value;
    });

    Validator.bindLiveValidation(form, fieldRules);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      fieldRules.confirmPassword[1].param = form.password.value;

      if (!Validator.validateForm(form, fieldRules)) return;

      const terms = form.querySelector('#terms');
      if (!terms.checked) {
        showToast('Please accept the terms and conditions', 'error');
        return;
      }

      try {
        await ApiClient.register({
          firstName: form.firstName.value.trim(),
          lastName: form.lastName.value.trim(),
          email: form.email.value.trim(),
          phone: form.phone.value.trim(),
          password: form.password.value
        });
        showToast('Registration successful! Please login.', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
      } catch (error) {
        showToast(error.message, 'error');
      }
    });
  },

  initPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.parentNode.querySelector('input');
        const icon = toggle.querySelector('i');
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
      });
    });
  },

  initRoleTabs() {
    const tabs = document.querySelectorAll('.auth-role-tab');
    const roleInput = document.querySelector('[name="role"]');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (roleInput) roleInput.value = tab.dataset.role;
        this.updateDemoCredentials(tab.dataset.role);
      });
    });

    const activeTab = document.querySelector('.auth-role-tab.active');
    if (activeTab) this.updateDemoCredentials(activeTab.dataset.role);
  },

  getActiveRole() {
    const activeTab = document.querySelector('.auth-role-tab.active');
    return activeTab?.dataset.role || 'patient';
  },

  updateDemoCredentials(role) {
    const demoBox = document.querySelector('.demo-credentials');
    if (!demoBox) return;
    const user = this.demoUsers[role];
    demoBox.innerHTML = `
      <h5><i class="fas fa-info-circle"></i> Demo Credentials</h5>
      <p>Email: <code>${user.email}</code></p>
      <p>Password: <code>${user.password}</code></p>
    `;
  },

  async login(email, password, role, remember) {
    try {
      const response = await ApiClient.login(email, password, role);
      const user = response.data;

      const session = {
        id: user.id,
        profileId: user.profileId,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      };

      if (remember) {
        localStorage.setItem('hms-session', JSON.stringify(session));
      } else {
        sessionStorage.setItem('hms-session', JSON.stringify(session));
      }

      showToast(`Welcome back, ${user.name}!`, 'success');

      const redirectMap = {
        patient: 'patient/dashboard.html',
        doctor: 'doctor/dashboard.html',
        admin: 'admin/dashboard.html'
      };

      setTimeout(() => {
        window.location.href = redirectMap[role];
      }, 1000);
    } catch (error) {
      showToast(error.message || 'Invalid email or password. Please try again.', 'error');
    }
  },

  logout() {
    localStorage.removeItem('hms-session');
    sessionStorage.removeItem('hms-session');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
      const depth = window.location.pathname.split('/').filter(p => p && !p.includes('.html')).length;
      const prefix = depth > 1 ? '../'.repeat(depth - 1) : '';
      window.location.href = `${prefix}login.html`;
    }, 1000);
  },

  getSession() {
    const session = localStorage.getItem('hms-session') || sessionStorage.getItem('hms-session');
    return session ? JSON.parse(session) : null;
  },

  checkAuth() {
    const session = this.getSession();
    const path = window.location.pathname;

    const isAdmin = path.includes('/admin/');
    const isDoctor = path.includes('/doctor/');
    const isPatient = path.includes('/patient/');
    const isDashboard = isAdmin || isDoctor || isPatient;

    if (isDashboard && !session) {
      window.location.href = '../login.html';
      return;
    }

    if (session && isDashboard) {
      const roleRoutes = {
        admin: '/admin/',
        doctor: '/doctor/',
        patient: '/patient/'
      };

      const expectedPath = roleRoutes[session.role];
      if (expectedPath && !path.includes(expectedPath)) {
        showToast('Access denied for your role', 'error');
        const redirectMap = {
          patient: '../patient/dashboard.html',
          doctor: '../doctor/dashboard.html',
          admin: '../admin/dashboard.html'
        };
        setTimeout(() => {
          window.location.href = redirectMap[session.role] || '../login.html';
        }, 1000);
        return;
      }
    }

    if (session) {
      document.querySelectorAll('.sidebar-user-info h5').forEach(el => {
        el.textContent = session.name;
      });
      document.querySelectorAll('.header-user-info h5').forEach(el => {
        el.textContent = session.name;
      });
      document.querySelectorAll('.sidebar-user-info span, .header-user-info span').forEach(el => {
        el.textContent = session.role.charAt(0).toUpperCase() + session.role.slice(1);
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => AuthManager.init());

document.querySelectorAll('.logout-btn, .sidebar-link.logout').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    AuthManager.logout();
  });
});

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${icons[type]}"></i>
    <span>${message}</span>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  container.appendChild(toast);
  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  setTimeout(() => toast.remove(), 4000);
}

function confirmDelete(itemName, onConfirm) {
  if (confirm(`Are you sure you want to delete ${itemName}?`)) {
    onConfirm();
  }
}

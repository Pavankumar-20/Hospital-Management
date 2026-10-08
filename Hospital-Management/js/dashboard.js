/**
 * Dashboard Shared Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initNotifications();
  initSettingsTabs();
  initTableSearch();
  initTableFilter();
  initPagination();
  initModals();
  initCalendar();
  setActiveSidebarLink();
});

/* Sidebar Toggle */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const close = document.querySelector('.sidebar-close');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!sidebar) return;

  if (!overlay) {
    const newOverlay = document.createElement('div');
    newOverlay.className = 'sidebar-overlay';
    document.body.appendChild(newOverlay);
  }

  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', openSidebar);
  close?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);
}

/* Active Sidebar Link */
function setActiveSidebarLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
      link.classList.add('active');
    }
  });
}

/* Notifications Dropdown */
function initNotifications() {
  const btn = document.querySelector('.notification-btn');
  const dropdown = document.querySelector('.notification-dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
  });
}

/* Settings Tabs */
function initSettingsTabs() {
  const tabs = document.querySelectorAll('.settings-tab');
  const panels = document.querySelectorAll('.settings-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

/* Table Search */
function initTableSearch() {
  const searchInputs = document.querySelectorAll('.table-search');
  searchInputs.forEach(input => {
    input.addEventListener('input', debounce(() => {
      const table = input.closest('.table-container')?.querySelector('.data-table');
      if (!table) return;
      const query = input.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    }, 300));
  });
}

/* Table Filter */
function initTableFilter() {
  const filters = document.querySelectorAll('.table-filter');
  filters.forEach(filter => {
    filter.addEventListener('change', () => {
      const table = filter.closest('.table-container')?.querySelector('.data-table') ||
                    document.querySelector('.data-table');
      if (!table) return;
      const value = filter.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(row => {
        if (value === 'all') {
          row.style.display = '';
        } else {
          const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';
          row.style.display = status.includes(value) ? '' : 'none';
        }
      });
    });
  });
}

/* Pagination */
function initPagination() {
  document.querySelectorAll('.pagination').forEach(pagination => {
    const table = pagination.closest('.table-container')?.querySelector('.data-table') ||
                  document.querySelector('.data-table');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const rowsPerPage = parseInt(pagination.dataset.rows) || 5;
    let currentPage = 1;
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    function showPage(page) {
      currentPage = page;
      rows.forEach((row, i) => {
        row.style.display = (i >= (page - 1) * rowsPerPage && i < page * rowsPerPage) ? '' : 'none';
      });
      updatePaginationUI();
    }

    function updatePaginationUI() {
      pagination.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.page) === currentPage);
      });
      const info = pagination.closest('.table-footer')?.querySelector('.table-info');
      if (info) {
        const start = (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(currentPage * rowsPerPage, rows.length);
        info.textContent = `Showing ${start}-${end} of ${rows.length} entries`;
      }
    }

    pagination.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const page = btn.dataset.page;
        if (page === 'prev') showPage(Math.max(1, currentPage - 1));
        else if (page === 'next') showPage(Math.min(totalPages, currentPage + 1));
        else showPage(parseInt(page));
      });
    });

    if (rows.length > 0) showPage(1);
  });
}

/* Modals */
function initModals() {
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modal;
      document.getElementById(modalId)?.classList.add('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('active');
    });
  });
}

/* Calendar Widget */
function initCalendar() {
  const calendar = document.querySelector('.calendar-widget');
  if (!calendar) return;

  let currentDate = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    calendar.querySelector('.calendar-header h4').textContent =
      `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid = calendar.querySelector('.calendar-grid');

    const dayNames = grid.querySelectorAll('.calendar-day-name');
    grid.innerHTML = '';
    dayNames.forEach(d => grid.appendChild(d.cloneNode(true)));

    for (let i = 0; i < firstDay; i++) {
      const day = document.createElement('div');
      day.className = 'calendar-day other-month';
      grid.appendChild(day);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const day = document.createElement('div');
      day.className = 'calendar-day';
      day.textContent = d;

      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        day.classList.add('today');
      }
      if ([5, 12, 18, 25].includes(d)) {
        day.classList.add('has-event');
      }

      grid.appendChild(day);
    }
  }

  calendar.querySelector('.calendar-nav.prev')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  calendar.querySelector('.calendar-nav.next')?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

/* Utility: Debounce */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* Toast for Dashboard */
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

/* Delete Confirmation */
function confirmDelete(itemName, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Confirm Delete</h3>
        <button class="modal-close"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete <strong>${itemName}</strong>? This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" data-close-modal>Cancel</button>
        <button class="btn btn-primary" style="background:var(--danger);">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('[data-close-modal]').addEventListener('click', () => overlay.remove());
  overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
  overlay.querySelector('.modal-footer .btn-primary').addEventListener('click', () => {
    callback();
    overlay.remove();
    showToast(`${itemName} deleted successfully`, 'success');
  });
}

document.querySelectorAll('.table-action-btn.delete').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('tr');
    const name = row?.querySelector('.table-user-info h5')?.textContent || 'this item';
    confirmDelete(name, () => row?.remove());
  });
});

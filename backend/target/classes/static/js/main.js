/**
 * Main JavaScript - Public Pages Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initNavbar();
  initScrollToTop();
  initScrollReveal();
  initTestimonialSlider();
  initFAQAccordion();
  initGalleryLightbox();
  initCounterAnimation();
  initContactForm();
  initDoctorSearch();
  loadPublicDepartments();
  loadPublicDoctors();
});

const DEPT_ICONS = {
  cardiology: 'fa-heart-pulse',
  neurology: 'fa-brain',
  orthopedics: 'fa-bone',
  pediatrics: 'fa-baby',
  dermatology: 'fa-hand-dots',
  general: 'fa-stethoscope'
};

async function loadPublicDepartments() {
  const grid = document.getElementById('departmentsGrid');
  if (!grid || typeof ApiClient === 'undefined') return;

  try {
    const response = await ApiClient.getDepartments();
    const departments = response.data || [];
    if (departments.length === 0) return;

    grid.innerHTML = departments.map((dept, index) => `
      <div class="dept-card glass-card reveal delay-${Math.min(index + 1, 5)}">
        <div class="dept-icon"><i class="fas ${DEPT_ICONS[dept.code] || 'fa-hospital'}"></i></div>
        <h4>${dept.name}</h4>
        <p>${dept.description || 'Specialized medical care and treatment'}</p>
      </div>
    `).join('');
  } catch (error) {
    console.warn('Could not load departments:', error.message);
  }
}

async function loadPublicDoctors() {
  const grid = document.getElementById('doctorsGrid');
  if (!grid || typeof ApiClient === 'undefined') return;

  try {
    const response = await ApiClient.getDoctors();
    const doctors = (response.data || []).slice(0, 6);
    if (doctors.length === 0) return;

    grid.innerHTML = doctors.map((doc, index) => `
      <div class="doctor-card glass-card reveal delay-${Math.min(index + 1, 5)}">
        <div class="doctor-image">
          <img src="${doc.avatarUrl}" alt="${doc.name}">
          <div class="doctor-social">
            <a href="login.html" title="Book appointment"><i class="fas fa-calendar-plus"></i></a>
            <a href="mailto:${doc.email}"><i class="fas fa-envelope"></i></a>
          </div>
        </div>
        <div class="doctor-info">
          <h4>${doc.name}</h4>
          <p class="specialty">${doc.specialty}${doc.department ? ' — ' + doc.department : ''}</p>
          <div class="doctor-rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i> 4.8</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.warn('Could not load doctors:', error.message);
  }
}

/* Loading Screen */
function initLoadingScreen() {
  const loader = document.querySelector('.loading-overlay');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 500);
    });
  }
}

/* Navbar */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 100;
      sections.forEach(section => {
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
      });
    });
  }
}

/* Scroll to Top */
function initScrollToTop() {
  const scrollBtn = document.querySelector('.scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 500);
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Scroll Reveal Animation */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* Testimonial Slider */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;

  let currentSlide = 0;
  const totalSlides = dots.length;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  setInterval(() => {
    goToSlide((currentSlide + 1) % totalSlides);
  }, 5000);
}

/* FAQ Accordion */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* Gallery Lightbox */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) showLightbox(img.src, img.alt);
    });
  });
}

function showLightbox(src, alt) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = `
    <div class="modal" style="max-width:800px;background:transparent;box-shadow:none;">
      <img src="${src}" alt="${alt}" style="width:100%;border-radius:12px;">
      <button class="modal-close" style="position:absolute;top:-40px;right:0;color:white;font-size:1.5rem;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.modal-close')) {
      overlay.remove();
    }
  });
}

/* Counter Animation */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

/* Contact Form */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValid = Validator.validateForm(form, {
      name: ['required', { name: 'minLength', param: 2 }],
      email: ['required', 'email'],
      subject: ['required'],
      message: ['required', { name: 'minLength', param: 10 }]
    });

    if (isValid) {
      showToast('Message sent successfully! We will get back to you soon.', 'success');
      form.reset();
    }
  });

  Validator.bindLiveValidation(form, {
    name: ['required'],
    email: ['required', 'email'],
    subject: ['required'],
    message: ['required']
  });
}

/* Doctor Search */
function initDoctorSearch() {
  const searchForm = document.getElementById('doctorSearchForm');
  if (!searchForm) return;

  const deptSelect = searchForm.querySelector('[name="department"]');
  if (deptSelect && typeof ApiClient !== 'undefined') {
    ApiClient.populateDepartmentSelect(deptSelect, { allLabel: 'All Departments' });
  }

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const department = searchForm.querySelector('[name="department"]').value;
    const doctorName = searchForm.querySelector('[name="doctor"]').value.trim().toLowerCase();

    try {
      let doctors = [];
      if (department) {
        const response = await ApiClient.getDoctorsByDepartment(department);
        doctors = response.data || [];
      } else {
        const response = await ApiClient.getDoctors();
        doctors = response.data || [];
      }

      if (doctorName) {
        doctors = doctors.filter(d => d.name.toLowerCase().includes(doctorName));
      }

      const grid = document.getElementById('doctorsGrid');
      if (grid && doctors.length > 0) {
        grid.innerHTML = doctors.map((doc, index) => `
          <div class="doctor-card glass-card reveal delay-${Math.min(index + 1, 5)}">
            <div class="doctor-image">
              <img src="${doc.avatarUrl}" alt="${doc.name}">
              <div class="doctor-social">
                <a href="login.html" title="Book appointment"><i class="fas fa-calendar-plus"></i></a>
                <a href="mailto:${doc.email}"><i class="fas fa-envelope"></i></a>
              </div>
            </div>
            <div class="doctor-info">
              <h4>${doc.name}</h4>
              <p class="specialty">${doc.specialty}${doc.department ? ' — ' + doc.department : ''}</p>
            </div>
          </div>
        `).join('');
        document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' });
        showToast(`Found ${doctors.length} doctor(s)`, 'success');
      } else {
        showToast('No doctors found matching your search', 'warning');
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

/* Toast Notifications */
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
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* Modal Utilities */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
  if (e.target.closest('.modal-close')) {
    e.target.closest('.modal-overlay')?.classList.remove('active');
  }
});

/* Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

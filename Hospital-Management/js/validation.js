/**
 * Form Validation Utilities
 */

const Validator = {
  rules: {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s\-+()]{10,15}$/.test(value.replace(/\s/g, '')),
    minLength: (value, min) => value.length >= min,
    maxLength: (value, max) => value.length <= max,
    password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
    match: (value, matchValue) => value === matchValue,
    date: (value) => !isNaN(Date.parse(value)),
    futureDate: (value) => new Date(value) > new Date(),
    number: (value) => !isNaN(value) && value !== '',
    positiveNumber: (value) => !isNaN(value) && parseFloat(value) > 0
  },

  messages: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: (min) => `Minimum ${min} characters required`,
    maxLength: (max) => `Maximum ${max} characters allowed`,
    password: 'Password must be 8+ chars with uppercase, lowercase & number',
    match: 'Fields do not match',
    date: 'Please enter a valid date',
    futureDate: 'Date must be in the future',
    number: 'Please enter a valid number',
    positiveNumber: 'Please enter a positive number'
  },

  validateField(input, rules) {
    const value = input.value.trim();
    const errors = [];

    for (const rule of rules) {
      let ruleName, ruleParam;

      if (typeof rule === 'string') {
        ruleName = rule;
      } else if (typeof rule === 'object') {
        ruleName = rule.name;
        ruleParam = rule.param;
      }

      let isValid = true;

      switch (ruleName) {
        case 'required':
          isValid = this.rules.required(value);
          break;
        case 'email':
          isValid = !value || this.rules.email(value);
          break;
        case 'phone':
          isValid = !value || this.rules.phone(value);
          break;
        case 'minLength':
          isValid = this.rules.minLength(value, ruleParam);
          break;
        case 'maxLength':
          isValid = this.rules.maxLength(value, ruleParam);
          break;
        case 'password':
          isValid = !value || this.rules.password(value);
          break;
        case 'match':
          isValid = this.rules.match(value, ruleParam);
          break;
        case 'date':
          isValid = !value || this.rules.date(value);
          break;
        case 'futureDate':
          isValid = !value || this.rules.futureDate(value);
          break;
        case 'number':
          isValid = !value || this.rules.number(value);
          break;
        case 'positiveNumber':
          isValid = !value || this.rules.positiveNumber(value);
          break;
      }

      if (!isValid) {
        const message = typeof this.messages[ruleName] === 'function'
          ? this.messages[ruleName](ruleParam)
          : this.messages[ruleName];
        errors.push(message);
        break;
      }
    }

    return errors;
  },

  showError(input, message) {
    this.clearError(input);
    input.classList.add('error');
    input.classList.remove('success');

    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    input.parentNode.appendChild(errorEl);
  },

  showSuccess(input) {
    this.clearError(input);
    input.classList.remove('error');
    input.classList.add('success');
  },

  clearError(input) {
    input.classList.remove('error', 'success');
    const existingError = input.parentNode.querySelector('.form-error');
    if (existingError) existingError.remove();
  },

  validateForm(form, fieldRules) {
    let isValid = true;

    for (const [fieldName, rules] of Object.entries(fieldRules)) {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) continue;

      const errors = this.validateField(input, rules);
      if (errors.length > 0) {
        this.showError(input, errors[0]);
        isValid = false;
      } else {
        this.showSuccess(input);
      }
    }

    return isValid;
  },

  bindLiveValidation(form, fieldRules) {
    for (const fieldName of Object.keys(fieldRules)) {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) continue;

      input.addEventListener('blur', () => {
        const errors = this.validateField(input, fieldRules[fieldName]);
        if (errors.length > 0) {
          this.showError(input, errors[0]);
        } else if (input.value.trim()) {
          this.showSuccess(input);
        } else {
          this.clearError(input);
        }
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          const errors = this.validateField(input, fieldRules[fieldName]);
          if (errors.length === 0) {
            this.showSuccess(input);
          }
        }
      });
    }
  }
};

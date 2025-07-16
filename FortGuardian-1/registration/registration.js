// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Get event parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventParam = urlParams.get('event');
    if (eventParam) {
        document.getElementById('event').value = eventParam;
    }

    // Validation rules
    const validationRules = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Full name must contain only letters and spaces'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[+]?[\d\s\-\(\)]{10,}$/,
            message: 'Please enter a valid phone number'
        },
        age: {
            required: true,
            min: 16,
            max: 65,
            message: 'Age must be between 16 and 65 years'
        },
        event: {
            required: true,
            message: 'Please select an event'
        },
        emergencyContact: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Emergency contact name must contain only letters and spaces'
        },
        emergencyPhone: {
            required: true,
            pattern: /^[+]?[\d\s\-\(\)]{10,}$/,
            message: 'Please enter a valid emergency contact phone number'
        },
        guidelines: {
            required: true,
            message: 'You must agree to the guidelines and terms'
        },
        waiver: {
            required: true,
            message: 'You must agree to the liability waiver'
        }
    };

    // Validate individual field
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        if (!rules) return { isValid: true };

        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        // Required check
        if (rules.required && (!value || value.trim() === '')) {
            return showError(field, errorElement, `${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }

        // Skip other validations if field is empty and not required
        if (!value || value.trim() === '') {
            return showSuccess(field, errorElement);
        }

        // Pattern check
        if (rules.pattern && !rules.pattern.test(value)) {
            return showError(field, errorElement, rules.message);
        }

        // Length checks
        if (rules.minLength && value.length < rules.minLength) {
            return showError(field, errorElement, `Minimum length is ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            return showError(field, errorElement, `Maximum length is ${rules.maxLength} characters`);
        }

        // Number range checks
        if (rules.min && parseInt(value) < rules.min) {
            return showError(field, errorElement, rules.message);
        }

        if (rules.max && parseInt(value) > rules.max) {
            return showError(field, errorElement, rules.message);
        }

        // Special validation for checkboxes
        if (fieldName === 'guidelines' || fieldName === 'waiver') {
            if (!document.getElementById(fieldName).checked) {
                return showError(field, errorElement, rules.message);
            }
        }

        return showSuccess(field, errorElement);
    }

    function showError(field, errorElement, message) {
        field.classList.add('error');
        field.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        return { isValid: false, message };
    }

    function showSuccess(field, errorElement) {
        field.classList.remove('error');
        field.classList.add('success');
        errorElement.classList.remove('show');
        return { isValid: true };
    }

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value || this.checked);
            });

            field.addEventListener('input', function() {
                if (field.classList.contains('error')) {
                    validateField(fieldName, this.value || this.checked);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        const formData = new FormData(form);

        // Validate all fields
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            let value;
            
            if (field.type === 'checkbox') {
                value = field.checked;
            } else {
                value = field.value;
            }

            const result = validateField(fieldName, value);
            if (!result.isValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            submitForm(formData);
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Submit form
    function submitForm(formData) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Simulate API call
        setTimeout(() => {
            // Generate registration ID
            const registrationId = 'FG' + Date.now().toString().slice(-8);
            document.getElementById('registrationId').textContent = registrationId;

            // Show success modal
            modal.style.display = 'block';
            
            // Reset form
            form.reset();
            
            // Remove validation classes
            form.querySelectorAll('.error, .success').forEach(el => {
                el.classList.remove('error', 'success');
            });
            
            // Reset button
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = originalText;

            // Store registration data (in real app, this would go to a server)
            localStorage.setItem('lastRegistration', JSON.stringify({
                id: registrationId,
                event: formData.get('event'),
                name: formData.get('fullName'),
                email: formData.get('email'),
                timestamp: new Date().toISOString()
            }));

        }, 2000); // Simulate network delay
    }

    // Modal close functionality
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
});

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove all non-digit characters except +
            let value = this.value.replace(/[^\d+]/g, '');
            
            // Format Indian phone numbers
            if (value.startsWith('+91')) {
                value = value.substring(0, 13); // +91 + 10 digits
            } else if (value.startsWith('91') && value.length > 10) {
                value = '+' + value.substring(0, 12);
            } else if (value.length > 10 && !value.startsWith('+')) {
                value = value.substring(0, 10);
            }
            
            this.value = value;
        });
    });
});

// Age validation
document.addEventListener('DOMContentLoaded', function() {
    const ageInput = document.getElementById('age');
    
    ageInput.addEventListener('input', function() {
        const age = parseInt(this.value);
        const warningDiv = document.getElementById('ageWarning');
        
        if (age < 16) {
            if (!warningDiv) {
                const warning = document.createElement('div');
                warning.id = 'ageWarning';
                warning.className = 'warning-message';
                warning.textContent = 'Participants must be at least 16 years old';
                warning.style.color = 'orange';
                warning.style.fontSize = '0.9rem';
                warning.style.marginTop = '0.5rem';
                this.parentNode.appendChild(warning);
            }
        } else if (age > 65) {
            if (!warningDiv) {
                const warning = document.createElement('div');
                warning.id = 'ageWarning';
                warning.className = 'warning-message';
                warning.textContent = 'Participants over 65 may require medical clearance';
                warning.style.color = 'orange';
                warning.style.fontSize = '0.9rem';
                warning.style.marginTop = '0.5rem';
                this.parentNode.appendChild(warning);
            }
        } else {
            if (warningDiv) {
                warningDiv.remove();
            }
        }
    });
});

// Form auto-save (optional feature)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    // Load saved data
    const savedData = localStorage.getItem('registrationFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key];
                } else {
                    field.value = data[key];
                }
            }
        });
    }
    
    // Auto-save on input
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const formData = {};
            formInputs.forEach(field => {
                if (field.type === 'checkbox') {
                    formData[field.id] = field.checked;
                } else {
                    formData[field.id] = field.value;
                }
            });
            localStorage.setItem('registrationFormData', JSON.stringify(formData));
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('registrationFormData');
    });
});

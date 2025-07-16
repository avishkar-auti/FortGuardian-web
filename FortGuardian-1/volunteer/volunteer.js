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
    const form = document.getElementById('volunteerForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'First name must contain only letters and spaces'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Last name must contain only letters and spaces'
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
            min: 18,
            max: 65,
            message: 'Age must be between 18 and 65 years'
        },
        city: {
            required: true,
            minLength: 2,
            message: 'Please enter your city'
        },
        availability: {
            required: true,
            message: 'Please select your availability'
        },
        motivation: {
            required: true,
            minLength: 50,
            message: 'Please provide at least 50 characters explaining your motivation'
        },
        agreement: {
            required: true,
            message: 'You must agree to the terms and conditions'
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
        if (fieldName === 'agreement') {
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

    // Validate interests checkboxes
    function validateInterests() {
        const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
        const errorElement = document.getElementById('interestsError');
        
        if (checkboxes.length === 0) {
            errorElement.textContent = 'Please select at least one area of interest';
            errorElement.classList.add('show');
            return false;
        }
        
        errorElement.classList.remove('show');
        return true;
    }

    // Add event listeners to interest checkboxes
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateInterests);
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

        // Validate interests
        if (!validateInterests()) {
            isFormValid = false;
        }

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
            // Generate application ID
            const applicationId = 'VOL' + Date.now().toString().slice(-8);
            document.getElementById('applicationId').textContent = applicationId;

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

            // Store application data
            const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);
            localStorage.setItem('volunteerApplication', JSON.stringify({
                id: applicationId,
                name: formData.get('firstName') + ' ' + formData.get('lastName'),
                email: formData.get('email'),
                interests: interests,
                timestamp: new Date().toISOString()
            }));

        }, 2000);
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

// Animation on scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.benefit-card, .role-card');
    
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (cardTop < windowHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animation styles
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.benefit-card, .role-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Initial check
    animateOnScroll();
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

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
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function() {
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

// Character counter for motivation field
document.addEventListener('DOMContentLoaded', function() {
    const motivationField = document.getElementById('motivation');
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.fontSize = '0.9rem';
    counter.style.color = 'var(--text-light)';
    counter.style.textAlign = 'right';
    counter.style.marginTop = '0.5rem';
    
    motivationField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const length = motivationField.value.length;
        counter.textContent = `${length}/50 characters minimum`;
        
        if (length >= 50) {
            counter.style.color = 'var(--success-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    motivationField.addEventListener('input', updateCounter);
    updateCounter();
});

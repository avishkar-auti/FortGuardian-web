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

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
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
            required: false,
            pattern: /^[+]?[\d\s\-\(\)]{10,}$/,
            message: 'Please enter a valid phone number'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 20,
            message: 'Please provide at least 20 characters in your message'
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

        return showSuccess(field, errorElement);
    }

    function showError(field, errorElement, message) {
        if (field) {
            field.classList.add('error');
            field.classList.remove('success');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        return { isValid: false, message };
    }

    function showSuccess(field, errorElement) {
        if (field) {
            field.classList.remove('error');
            field.classList.add('success');
        }
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        return { isValid: true };
    }

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldName, this.value);
            });

            field.addEventListener('input', function() {
                if (field.classList.contains('error')) {
                    validateField(fieldName, this.value);
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
            const value = field ? field.value : '';

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
        submitButton.textContent = 'Sending...';

        // Simulate API call
        setTimeout(() => {
            // Generate reference ID
            const referenceId = 'FG-' + Date.now().toString().slice(-8);
            document.getElementById('referenceId').textContent = referenceId;

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

            // Store contact data
            localStorage.setItem('contactInquiry', JSON.stringify({
                id: referenceId,
                name: formData.get('firstName') + ' ' + formData.get('lastName'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
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
    const animatedElements = document.querySelectorAll('.contact-item, .faq-item, .social-link');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animation styles
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.contact-item, .faq-item, .social-link');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
    
    if (phoneInput) {
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
    }
});

// Character counter for message field
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('message');
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.fontSize = '0.9rem';
    counter.style.color = 'var(--text-light)';
    counter.style.textAlign = 'right';
    counter.style.marginTop = '0.5rem';
    
    messageField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const length = messageField.value.length;
        counter.textContent = `${length}/20 characters minimum`;
        
        if (length >= 20) {
            counter.style.color = 'var(--success-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter();
});

// Social media link tracking
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Social media link clicked:', this.className);
            // In a real application, you would track this click
            // and then redirect to the actual social media page
        });
    });
});

// Map link functionality
document.addEventListener('DOMContentLoaded', function() {
    const mapLink = document.querySelector('.map-content .btn');
    
    if (mapLink) {
        mapLink.addEventListener('click', function() {
            // Track map link clicks
            console.log('Map link clicked');
            // Link will open in new tab as specified in HTML
        });
    }
});

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
    const form = document.getElementById('testimonialForm');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    
    // Validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Name must contain only letters and spaces'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        eventType: {
            required: true,
            message: 'Please select an event type'
        },
        rating: {
            required: true,
            message: 'Please provide a rating'
        },
        testimonial: {
            required: true,
            minLength: 20,
            message: 'Please provide at least 20 characters in your testimonial'
        },
        consent: {
            required: true,
            message: 'You must consent to use your testimonial'
        }
    };

    // Validate individual field
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];
        if (!rules) return { isValid: true };

        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
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

        // Special validation for checkboxes
        if (fieldName === 'consent') {
            if (!document.getElementById(fieldName).checked) {
                return showError(field, errorElement, rules.message);
            }
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
                validateField(fieldName, this.value || this.checked);
            });

            field.addEventListener('input', function() {
                if (field.classList.contains('error')) {
                    validateField(fieldName, this.value || this.checked);
                }
            });
        }
    });

    // Rating validation
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateField('rating', this.value);
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isFormValid = true;
        const formData = new FormData(form);

        // Validate all fields
        Object.keys(validationRules).forEach(fieldName => {
            let value;
            
            if (fieldName === 'rating') {
                const checkedRating = document.querySelector('input[name="rating"]:checked');
                value = checkedRating ? checkedRating.value : '';
            } else if (fieldName === 'consent') {
                value = document.getElementById(fieldName).checked;
            } else {
                const field = document.getElementById(fieldName);
                value = field ? field.value : '';
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

            // Store testimonial data
            const rating = document.querySelector('input[name="rating"]:checked');
            localStorage.setItem('testimonial', JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                eventType: formData.get('eventType'),
                rating: rating ? rating.value : '',
                testimonial: formData.get('testimonial'),
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
    const cards = document.querySelectorAll('.testimonial-card, .stat-card');
    
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
    const cards = document.querySelectorAll('.testimonial-card, .stat-card');
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

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent);
        const isDecimal = counter.textContent.includes('.');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '');
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('%') ? '%' : '');
            }
        };
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(counter);
    });
}

// Initialize counter animation
document.addEventListener('DOMContentLoaded', animateCounters);

// Character counter for testimonial field
document.addEventListener('DOMContentLoaded', function() {
    const testimonialField = document.getElementById('testimonial');
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.fontSize = '0.9rem';
    counter.style.color = 'var(--text-light)';
    counter.style.textAlign = 'right';
    counter.style.marginTop = '0.5rem';
    
    testimonialField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const length = testimonialField.value.length;
        counter.textContent = `${length}/20 characters minimum`;
        
        if (length >= 20) {
            counter.style.color = 'var(--success-color)';
        } else {
            counter.style.color = 'var(--text-light)';
        }
    }
    
    testimonialField.addEventListener('input', updateCounter);
    updateCounter();
});

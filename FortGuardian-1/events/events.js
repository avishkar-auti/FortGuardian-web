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

// Event Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter events
            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                }
            });
        });
    });
});

// Search functionality (optional enhancement)
function searchEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Animation on scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.event-card, .guideline-card');
    
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
    const cards = document.querySelectorAll('.event-card, .guideline-card');
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

// Registration link enhancement
document.addEventListener('DOMContentLoaded', function() {
    const registrationLinks = document.querySelectorAll('a[href*="registration"]');
    
    registrationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';
            
            // Simulate loading (remove in production)
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
});

// Map link tracking (optional analytics)
document.addEventListener('DOMContentLoaded', function() {
    const mapLinks = document.querySelectorAll('.map-link');
    
    mapLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track map link clicks
            console.log('Map link clicked:', this.href);
            // Add analytics code here if needed
        });
    });
});

// Event card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Countdown timer for event deadlines (optional enhancement)
function updateCountdowns() {
    const eventInfos = document.querySelectorAll('.event-info');
    
    eventInfos.forEach(info => {
        const text = info.textContent;
        if (text.includes('Registration ends:')) {
            const dateStr = text.split('Registration ends: ')[1];
            const deadline = new Date(dateStr);
            const now = new Date();
            const timeLeft = deadline - now;
            
            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                if (days > 0) {
                    info.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>Registration ends in ${days} days ${hours} hours</span>`;
                } else if (hours > 0) {
                    info.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>Registration ends in ${hours} hours</span>`;
                } else {
                    info.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span style="color: red;">Registration closes soon!</span>`;
                }
            }
        }
    });
}

// Update countdowns every hour
setInterval(updateCountdowns, 3600000);
document.addEventListener('DOMContentLoaded', updateCountdowns);

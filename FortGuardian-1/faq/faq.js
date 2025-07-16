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

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});

// Category Filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('noResults');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Clear search when filtering by category
            clearSearch();

            // Filter FAQ items
            let visibleCount = 0;
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                    item.classList.remove('active'); // Close expanded items when hiding
                }
            });

            // Show/hide no results message
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        });
    });
});

// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('noResults');
    const categoryButtons = document.querySelectorAll('.category-btn');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (searchTerm.length > 0) {
            clearButton.classList.add('show');
        } else {
            clearButton.classList.remove('show');
        }

        // Reset category filter when searching
        if (searchTerm.length > 0) {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-category="all"]').classList.add('active');
        }

        performSearch(searchTerm);
    });

    clearButton.addEventListener('click', function() {
        clearSearch();
    });

    function performSearch(searchTerm) {
        let visibleCount = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            // Remove previous highlights
            removeHighlights(item);
            
            if (searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.classList.remove('hidden');
                item.classList.add('visible');
                visibleCount++;
                
                // Highlight search terms
                if (searchTerm !== '') {
                    highlightSearchTerms(item, searchTerm);
                }
            } else {
                item.classList.add('hidden');
                item.classList.remove('visible');
                item.classList.remove('active'); // Close expanded items when hiding
            }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm !== '') {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    function highlightSearchTerms(item, searchTerm) {
        const questionElement = item.querySelector('.faq-question h3');
        const answerElement = item.querySelector('.faq-answer');
        
        // Highlight in question
        const questionText = questionElement.textContent;
        const highlightedQuestion = questionText.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<span class="highlight">${match}</span>`
        );
        questionElement.innerHTML = highlightedQuestion;
        
        // Highlight in answer (more complex due to HTML structure)
        const answerElements = answerElement.querySelectorAll('p, li');
        answerElements.forEach(element => {
            const text = element.textContent;
            const highlightedText = text.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<span class="highlight">${match}</span>`
            );
            if (text !== highlightedText) {
                element.innerHTML = highlightedText;
            }
        });
    }

    function removeHighlights(item) {
        const highlights = item.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize(); // Merge adjacent text nodes
        });
    }
});

// Global clear search function
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('noResults');

    searchInput.value = '';
    clearButton.classList.remove('show');
    
    // Remove highlights
    faqItems.forEach(item => {
        const highlights = item.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
        
        // Show all items
        item.classList.remove('hidden');
        item.classList.add('visible');
    });
    
    noResults.style.display = 'none';
}

// Animation on scroll
function animateOnScroll() {
    const faqItems = document.querySelectorAll('.faq-item:not(.hidden)');
    
    faqItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight - 100) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animation styles
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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

// Keyboard navigation for FAQ items
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach((question, index) => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextQuestion = faqQuestions[index + 1];
                if (nextQuestion) {
                    nextQuestion.focus();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevQuestion = faqQuestions[index - 1];
                if (prevQuestion) {
                    prevQuestion.focus();
                }
            }
        });
        
        // Update aria-expanded when FAQ item is toggled
        const faqItem = question.closest('.faq-item');
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = faqItem.classList.contains('active');
                    question.setAttribute('aria-expanded', isActive.toString());
                }
            });
        });
        
        observer.observe(faqItem, { attributes: true });
    });
});

// Analytics tracking for FAQ interactions
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Track FAQ item clicks
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const questionText = this.querySelector('h3').textContent;
            console.log('FAQ clicked:', questionText);
            // In a real application, you would send this to analytics
        });
    });
    
    // Track search queries
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.trim().length > 2) {
                console.log('FAQ search:', this.value.trim());
                // In a real application, you would send this to analytics
            }
        }, 1000);
    });
    
    // Track category filter usage
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('FAQ category filtered:', category);
            // In a real application, you would send this to analytics
        });
    });
});

// Auto-expand FAQ item based on URL hash
document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement && targetElement.classList.contains('faq-item')) {
            setTimeout(() => {
                targetElement.classList.add('active');
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }
});

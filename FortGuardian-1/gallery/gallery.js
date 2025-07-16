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

// Gallery Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('visible');
                }
            });
        });
    });
});

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalCategory = document.getElementById('modalCategory');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentImageIndex = 0;
    let visibleImages = [];

    function updateVisibleImages() {
        visibleImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }

    function openModal(index) {
        updateVisibleImages();
        currentImageIndex = index;
        showImage(currentImageIndex);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showImage(index) {
        if (index < 0) index = visibleImages.length - 1;
        if (index >= visibleImages.length) index = 0;
        
        currentImageIndex = index;
        const item = visibleImages[index];
        const img = item.querySelector('img');
        const info = item.querySelector('.gallery-info');
        
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = info.querySelector('h3').textContent;
        modalDate.textContent = info.querySelector('p').textContent;
        modalCategory.textContent = info.querySelector('.event-type').textContent;
        modalCategory.className = 'event-type';
    }

    function nextImage() {
        showImage(currentImageIndex + 1);
    }

    function prevImage() {
        showImage(currentImageIndex - 1);
    }

    // Event listeners for gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            const allItems = Array.from(document.querySelectorAll('.gallery-item'));
            const itemIndex = allItems.indexOf(item);
            openModal(itemIndex);
        });
    });

    // Modal controls
    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Close modal when clicking outside image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
            }
        }
    });
});

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('loading');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
        imageObserver.observe(img);
    });
});

// Animation on scroll
function animateOnScroll() {
    const items = document.querySelectorAll('.gallery-item, .stat-card');
    
    items.forEach(item => {
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
    const items = document.querySelectorAll('.gallery-item, .stat-card');
    items.forEach(item => {
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

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
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

// Image loading with error handling
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.gallery-item img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Image+Not+Available';
            this.alt = 'Image not available';
        });
        
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});

// Touch/swipe support for mobile modal navigation
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    let startX = 0;
    let endX = 0;
    
    modal.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    modal.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next image
                document.getElementById('nextBtn').click();
            } else {
                // Swipe right - previous image
                document.getElementById('prevBtn').click();
            }
        }
    }
});

// Search functionality (can be enhanced)
function searchGallery(searchTerm) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const term = searchTerm.toLowerCase();
    
    galleryItems.forEach(item => {
        const title = item.querySelector('.gallery-info h3').textContent.toLowerCase();
        const category = item.querySelector('.event-type').textContent.toLowerCase();
        
        if (title.includes(term) || category.includes(term)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Download functionality (optional)
function downloadImage(imgSrc, filename) {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add download button to modal (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const modalInfo = document.querySelector('.modal-info');
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    downloadBtn.className = 'download-btn';
    downloadBtn.style.cssText = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        transition: var(--transition);
    `;
    
    downloadBtn.addEventListener('click', function() {
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        downloadImage(modalImage.src, modalTitle.textContent + '.jpg');
    });
    
    modalInfo.appendChild(downloadBtn);
});

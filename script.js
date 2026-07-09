document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // Mobile Navigation Menu Toggle
    // ==========================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // Helper to auto select booking type when clicking CTA buttons
    window.setPillarField = function(bookingType) {
        const select = document.getElementById('booking-type');
        if (select) {
            select.value = bookingType;
        }
    };

    // ==========================================================================
    // Testimonials Slider
    // ==========================================================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
    }
    
    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        
        // Auto-rotation every 8 seconds
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 8000);
    }

    // ==========================================================================
    // Booking Form Simulation
    // ==========================================================================
    const bookingForm = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');
    
    if (bookingForm && formSuccess) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Display success overlay
            formSuccess.classList.add('active');
            bookingForm.reset();
        });
    }
    
    window.closeSuccessModal = function() {
        if (formSuccess) {
            formSuccess.classList.remove('active');
        }
    };

    // ==========================================================================
    // Stat Counter Animations (Scroll Triggered)
    // ==========================================================================
    const statsSection = document.querySelector('.stats-bar-section');
    const statNumbers = document.querySelectorAll('.stat-num');
    let animated = false;
    
    const countUp = (element) => {
        const targetAttr = element.getAttribute('data-target');
        if (!targetAttr) return; // For non-numerical stats like "ISO"
        
        const target = +targetAttr;
        const speed = 100;
        const step = target / speed;
        let current = 0;
        
        const updateCount = () => {
            current += step;
            if (current < target) {
                if (target >= 1000) {
                    element.innerText = Math.floor(current / 1000) + 'k+';
                } else {
                    element.innerText = Math.floor(current) + '+';
                }
                setTimeout(updateCount, 15);
            } else {
                if (target >= 1000) {
                    element.innerText = (target / 1000) + 'k+';
                } else {
                    element.innerText = target + '+';
                }
            }
        };
        
        updateCount();
    };
    
    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    statNumbers.forEach(num => countUp(num));
                    animated = true;
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }
    
    // ==========================================================================
    // Scroll Entrance Animations (Fade-in Class Trigger)
    // ==========================================================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        fadeElements.forEach(el => fadeObserver.observe(el));
    }
});

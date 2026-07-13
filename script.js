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
        const suffix = element.getAttribute('data-suffix') || '+';
        if (!targetAttr) return; // For non-numerical stats like "ISO"
        
        const target = +targetAttr;
        const speed = 100;
        const step = target / speed;
        let current = 0;
        
        const updateCount = () => {
            current += step;
            if (current < target) {
                if (target >= 1000) {
                    element.innerText = Math.floor(current / 1000) + 'k' + suffix;
                } else {
                    element.innerText = Math.floor(current) + suffix;
                }
                setTimeout(updateCount, 15);
            } else {
                if (target >= 1000) {
                    element.innerText = (target / 1000) + 'k' + suffix;
                } else {
                    element.innerText = target + suffix;
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

    // ==========================================================================
    // Dynamic Events Loading
    // ==========================================================================
    const eventsContainer = document.getElementById('events-container');
    
    if (eventsContainer) {
        fetch('data/events.json')
            .then(res => res.json())
            .then(events => {
                const now = new Date();
                now.setHours(0,0,0,0);
                
                let renderedCount = 0;
                
                events.forEach(event => {
                    if (event.is_hidden) return;
                    
                    const eventDate = new Date(event.date);
                    eventDate.setHours(0,0,0,0);
                    
                    const diffTime = eventDate - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays < 0) return; // Expired
                    
                    renderedCount++;
                    
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    const monthStr = monthNames[eventDate.getMonth()];
                    const dayStr = String(eventDate.getDate()).padStart(2, '0');
                    
                    let highlightHtml = '';
                    if (diffDays >= 0 && diffDays <= 7) {
                        highlightHtml = `<div style="position:absolute; top:-10px; right:20px; background:var(--gold); color:#000; padding:5px 15px; border-radius:20px; font-weight:bold; font-size:0.8rem; box-shadow:0 0 10px rgba(201,160,42,0.5); z-index:10;">${diffDays === 0 ? 'TODAY!' : diffDays + ' Days Left!'}</div>`;
                    }
                    
                    const eventHtml = `
                        <div class="event-item" style="position:relative;">
                            ${highlightHtml}
                            <div class="event-date">
                                <span class="day">${dayStr}</span>
                                <span class="month">${monthStr}</span>
                            </div>
                            <div class="event-image-wrapper">
                                <img src="${event.image_url}" alt="${event.title}" class="event-img" onerror="this.src='images/hero.jpg'">
                            </div>
                            <div class="event-details">
                                <h3>${event.title}</h3>
                                <p>${event.location} • ${event.time}</p>
                            </div>
                            <div class="event-action">
                                <a href="${event.link}" class="btn btn-secondary">Get Tickets</a>
                            </div>
                        </div>
                    `;
                    eventsContainer.insertAdjacentHTML('beforeend', eventHtml);
                });
                
                if (renderedCount === 0) {
                    eventsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style:italic;">No upcoming events at the moment. Stay tuned!</p>';
                }
            })
            .catch(err => {
                console.error("Error loading events:", err);
                eventsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style:italic;">Failed to load events.</p>';
            });
    }
});

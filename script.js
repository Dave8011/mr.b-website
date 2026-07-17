document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Navigation logic has been moved to components.js

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
    // Dynamic Hero Banner Configuration
    // ==========================================================================
    const bannerContainer = document.getElementById('dynamic-banner-container');
    if (bannerContainer) {
        fetch('data/siteConfig.json?v=' + new Date().getTime())
            .then(res => res.json())
            .then(config => {
                if (config) {
                    if (config.showHeroBanner === false) {
                        bannerContainer.style.display = 'none';
                        const mainHero = document.getElementById('main-hero-section');
                        if (mainHero) mainHero.style.paddingTop = '120px';
                    } else if (config.activeBannerUrls && config.activeBannerUrls.length > 0) {
                        const urls = config.activeBannerUrls;
                        
                        if (urls.length === 1) {
                            // Single image mode
                            const bannerImg = document.getElementById('dynamic-hero-banner');
                            if (bannerImg) bannerImg.src = urls[0] + '?v=' + new Date().getTime();
                        } else {
                            // Slideshow mode
                            bannerContainer.innerHTML = '';
                            
                            // Placeholder to maintain responsive height
                            const placeholder = document.createElement('img');
                            placeholder.src = urls[0];
                            placeholder.style.width = '100%';
                            placeholder.style.height = 'auto';
                            placeholder.style.maxHeight = '70vh';
                            placeholder.style.objectFit = 'cover';
                            placeholder.style.visibility = 'hidden';
                            placeholder.style.display = 'block';
                            bannerContainer.appendChild(placeholder);
                            
                            const slides = [];
                            urls.forEach((url, i) => {
                                const slide = document.createElement('div');
                                slide.style.position = 'absolute';
                                slide.style.top = '80px';
                                slide.style.left = '0';
                                slide.style.width = '100%';
                                slide.style.height = 'calc(100% - 80px)';
                                slide.style.backgroundImage = `url(${url})`;
                                slide.style.backgroundSize = 'cover';
                                slide.style.backgroundPosition = 'center';
                                slide.style.opacity = i === 0 ? '1' : '0';
                                slide.style.transition = 'opacity 1s ease-in-out';
                                bannerContainer.appendChild(slide);
                                slides.push(slide);
                            });
                            
                            let currentSlide = 0;
                            setInterval(() => {
                                slides[currentSlide].style.opacity = '0';
                                currentSlide = (currentSlide + 1) % slides.length;
                                slides[currentSlide].style.opacity = '1';
                            }, 5000);
                        }
                    }
                    
                    // ==========================================================================
                    // Dynamic Clients/Brands Configuration
                    // ==========================================================================
                    const clientsSection = document.getElementById('dynamic-clients-section');
                    if (clientsSection) {
                        if (config.showClientsSection === false || !config.clients || config.clients.filter(c => !c.hidden).length === 0) {
                            clientsSection.style.display = 'none';
                        } else {
                            clientsSection.style.display = 'block';
                            
                            const visibleClients = config.clients.filter(c => !c.hidden);
                            const sectionTitle = config.clientsSectionTitle || "Our happy and satisfied Clients :";
                            
                            let clientsHtml = `
                                <div class="container" style="max-width: 100%; padding: 0;">
                                    <div class="section-slide-header text-center fade-in visible">
                                        <div class="slide-num">05 // TRUSTED BY</div>
                                        <h2 class="slide-subtitle">${sectionTitle}</h2>
                                    </div>
                                    <div class="marquee-container fade-in visible">
                                        <div class="marquee-content">
                            `;
                            
                            let cardsHtml = '';
                            visibleClients.forEach(client => {
                                cardsHtml += `
                                    <div class="client-card">
                                        <div class="client-logo-wrapper">
                                            <img src="${client.logoUrl}" alt="${client.name}" class="client-logo">
                                        </div>
                                        <div class="client-name">${client.name}</div>
                                    </div>
                                `;
                            });
                            
                            // Duplicate cards for seamless infinite scroll
                            clientsHtml += cardsHtml + cardsHtml;
                            
                            clientsHtml += `
                                        </div>
                                    </div>
                                </div>
                            `;
                            
                            clientsSection.innerHTML = clientsHtml;
                        }
                    }
                }
            })
            .catch(err => {
                console.log("No config found or error loading, defaulting to showing banner");
            });
    }

    // ==========================================================================
    // Dynamic Events Loading
    // ==========================================================================
    const eventsContainer = document.getElementById('events-container');
    const categoryPillsContainer = document.getElementById('event-category-pills');
    
    if (eventsContainer) {
        fetch('data/events.json')
            .then(res => res.json())
            .then(events => {
                const now = new Date();
                now.setHours(0,0,0,0);
                
                let activeEvents = [];
                const availableCategories = new Set();
                
                events.forEach(event => {
                    if (event.is_hidden) return;
                    
                    const eventDate = new Date(event.date);
                    eventDate.setHours(0,0,0,0);
                    
                    const diffTime = eventDate - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays < 0) return; // Expired
                    
                    const category = event.category || 'events'; // Default to 'events' if missing
                    availableCategories.add(category.toLowerCase());
                    
                    activeEvents.push({...event, diffDays, category: category.toLowerCase()});
                });
                
                if (activeEvents.length === 0) {
                    eventsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style:italic;">No upcoming events at the moment. Stay tuned!</p>';
                    return;
                }
                
                function renderEventsList(filterCategory) {
                    eventsContainer.innerHTML = '';
                    let renderedCount = 0;
                    
                    activeEvents.forEach(event => {
                        if (filterCategory && filterCategory !== 'all' && event.category !== filterCategory) {
                            return;
                        }
                        
                        renderedCount++;
                        const eventDate = new Date(event.date);
                        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        const monthStr = monthNames[eventDate.getMonth()];
                        const dayStr = String(eventDate.getDate()).padStart(2, '0');
                        
                        let highlightHtml = '';
                        if (event.diffDays >= 0 && event.diffDays <= 7) {
                            highlightHtml = `<div style="position:absolute; top:-10px; right:20px; background:var(--gold); color:#000; padding:5px 15px; border-radius:20px; font-weight:bold; font-size:0.8rem; box-shadow:0 0 10px rgba(201,160,42,0.5); z-index:10;">${event.diffDays === 0 ? 'TODAY!' : event.diffDays + ' Days Left!'}</div>`;
                        }
                        
                        const eventHtml = `
                            <div class="event-item" style="position:relative;">
                                ${highlightHtml}
                                <div class="event-date">
                                    <span class="day">${dayStr}</span>
                                    <span class="month">${monthStr}</span>
                                </div>
                                <div class="event-image-wrapper">
                                    <img src="${event.image_url}" alt="${event.image_alt || event.title}" class="event-img" onerror="this.src='images/hero.jpg'">
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
                        eventsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style:italic;">No upcoming items found in this category.</p>';
                    }
                }
                
                if (categoryPillsContainer) {
                    categoryPillsContainer.style.display = 'flex';
                    
                    const pills = categoryPillsContainer.querySelectorAll('.btn-pill');
                    let activeCategory = 'events';
                    
                    // Check if default active category exists, otherwise use first available
                    if (!availableCategories.has(activeCategory) && availableCategories.size > 0) {
                        activeCategory = Array.from(availableCategories)[0];
                    }
                    
                    pills.forEach(pill => {
                        const pillCat = pill.getAttribute('data-category');
                        if (!availableCategories.has(pillCat)) {
                            pill.style.display = 'none'; // Auto-hide if no events
                        } else {
                            pill.style.display = 'inline-block';
                            
                            // Set initial active state
                            if (pillCat === activeCategory) {
                                pill.classList.add('active');
                            } else {
                                pill.classList.remove('active');
                            }
                            
                            pill.addEventListener('click', () => {
                                pills.forEach(p => p.classList.remove('active'));
                                pill.classList.add('active');
                                renderEventsList(pillCat);
                            });
                        }
                    });
                    
                    // Hide entire container if multiple tabs aren't needed, but per request we "auto hide the pil".
                    // If only 1 pill is shown, maybe we still show it or hide the container? Let's just leave it as pills.
                    if (availableCategories.size === 0) {
                        categoryPillsContainer.style.display = 'none';
                    }
                    
                    renderEventsList(activeCategory);
                } else {
                    renderEventsList('all');
                }
            })
            .catch(err => {
                console.error("Error loading events:", err);
                eventsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style:italic;">Failed to load events.</p>';
            });
    }
});

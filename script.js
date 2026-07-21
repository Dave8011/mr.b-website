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
    const statsSection = document.getElementById('dynamic-stats-section');
    window.initStatsAnimation = function() {
        const statsSection = document.getElementById('dynamic-stats-section');
        const statNumbers = document.querySelectorAll('.stat-num');
        
        if (!statsSection || statNumbers.length === 0) return;
        
        // Ensure we don't attach multiple observers
        if (statsSection._statsObserver) {
            statsSection._statsObserver.disconnect();
        }
        
        const countUp = (element) => {
            const targetAttr = element.getAttribute('data-target');
            const suffix = element.getAttribute('data-suffix') || '';
            if (!targetAttr) return;
            
            const target = +targetAttr;
            const frames = 60; // 60 steps for animation
            const step = target / frames;
            let current = 0;
            
            if (element._countInterval) clearInterval(element._countInterval);
            
            element._countInterval = setInterval(() => {
                current += step;
                if (current < target) {
                    element.innerText = Math.floor(current) + suffix;
                } else {
                    element.innerText = target + suffix;
                    clearInterval(element._countInterval);
                }
            }, 35); // 35ms * 60 frames = ~2.1s duration
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => {
                        num.innerText = "0" + (num.getAttribute('data-suffix') || '');
                        countUp(num);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
        statsSection._statsObserver = observer;
    };
    
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
    // Dynamic Site Configuration (runs on EVERY page)
    // ==========================================================================
    fetch('data/siteConfig.json?v=' + new Date().getTime())
        .then(res => res.json())
        .then(config => {
            if (!config) return;

            // ── Hero Banner (index.html only) ─────────────────────────────
            const bannerContainer = document.getElementById('dynamic-banner-container');
            if (bannerContainer) {
                if (config.showHeroBanner === false) {
                    bannerContainer.style.display = 'none';
                    const mainHero = document.getElementById('about-intro-section');
                    if (mainHero) mainHero.style.paddingTop = '120px';
                } else if (config.activeBannerUrls && config.activeBannerUrls.length > 0) {
                    bannerContainer.style.display = 'block';
                    const mainHero = document.getElementById('about-intro-section');
                    if (mainHero) mainHero.style.paddingTop = '4rem';

                    const urls = config.activeBannerUrls;
                    
                    if (urls.length === 1) {
                        const bannerImg = document.getElementById('dynamic-hero-banner');
                        if (bannerImg) bannerImg.src = urls[0] + '?v=' + new Date().getTime();
                    } else {
                        bannerContainer.innerHTML = '';
                        const placeholder = document.createElement('img');
                        placeholder.src = urls[0];
                        placeholder.style.cssText = 'width:100%;height:auto;max-height:70vh;object-fit:cover;visibility:hidden;display:block;';
                        bannerContainer.appendChild(placeholder);
                        
                        const slideEls = [];
                        urls.forEach((url, i) => {
                            const slide = document.createElement('div');
                            slide.style.cssText = `position:absolute;top:80px;left:0;width:100%;height:calc(100% - 80px);background-image:url(${url});background-size:cover;background-position:center;opacity:${i === 0 ? '1' : '0'};transition:opacity 1s ease-in-out;`;
                            bannerContainer.appendChild(slide);
                            slideEls.push(slide);
                        });
                        
                        let cur = 0;
                        setInterval(() => {
                            slideEls[cur].style.opacity = '0';
                            cur = (cur + 1) % slideEls.length;
                            slideEls[cur].style.opacity = '1';
                        }, 5000);
                    }
                }
            }

            // ── About Section (index.html only) ───────────────────────────
            const aboutSection = document.getElementById('about-intro-section');
            if (aboutSection && config.aboutSection) {
                if (config.aboutSection.isVisible === false) {
                    aboutSection.style.display = 'none';
                } else {
                    aboutSection.style.display = 'block';
                    const tagEl = document.getElementById('about-dynamic-tag');
                    const titleEl = document.getElementById('about-dynamic-title');
                    const descEl = document.getElementById('about-dynamic-desc');
                    const btnEl = document.getElementById('about-dynamic-btn');
                    
                    if (tagEl && config.aboutSection.tag) tagEl.textContent = config.aboutSection.tag;
                    if (descEl && config.aboutSection.description) descEl.textContent = config.aboutSection.description;
                    
                    if (titleEl) {
                        const regText = config.aboutSection.titleRegular || '';
                        const goldText = config.aboutSection.titleGold || '';
                        
                        // Clear existing content safely
                        titleEl.textContent = regText + (goldText ? ' ' : '');
                        
                        if (goldText) {
                            const span = document.createElement('span');
                            span.className = 'gold-text';
                            span.textContent = goldText;
                            titleEl.appendChild(span);
                        }
                    }
                    
                    if (btnEl) {
                        if (config.aboutSection.btnText) btnEl.innerHTML = config.aboutSection.btnText;
                        if (config.aboutSection.btnLink) btnEl.href = config.aboutSection.btnLink;
                    }
                }
            }
            
            // ── About Us Page (about.html only) ───────────────────────────
            const aboutUsHeroSubtitle = document.getElementById('about-us-hero-subtitle');
            if (aboutUsHeroSubtitle && config.aboutUsPage) {
                const data = config.aboutUsPage;
                
                if (data.heroSubtitle) {
                    aboutUsHeroSubtitle.textContent = data.heroSubtitle;
                }
                
                // Box 1
                const box1Title = document.getElementById('about-us-box1-title');
                if (box1Title && data.box1?.title) box1Title.textContent = data.box1.title;
                
                const box1Highlight = document.getElementById('about-us-box1-highlight');
                if (box1Highlight && data.box1?.highlight) box1Highlight.textContent = data.box1.highlight;
                
                const box1List = document.getElementById('about-us-box1-list');
                if (box1List && data.box1?.list) {
                    box1List.innerHTML = '';
                    data.box1.list.split('\n').filter(p => p.trim() !== '').forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        box1List.appendChild(li);
                    });
                }
                
                // Box 2
                const box2Title = document.getElementById('about-us-box2-title');
                if (box2Title && data.box2?.title) box2Title.textContent = data.box2.title;
                
                const box2Text = document.getElementById('about-us-box2-text');
                if (box2Text && data.box2?.text) {
                    box2Text.innerHTML = '';
                    data.box2.text.split('\n').filter(p => p.trim() !== '').forEach(item => {
                        const p = document.createElement('p');
                        p.textContent = item;
                        box2Text.appendChild(p);
                    });
                }
                
                // Box 3
                const box3Title = document.getElementById('about-us-box3-title');
                if (box3Title && data.box3?.title) box3Title.textContent = data.box3.title;
                
                const box3List = document.getElementById('about-us-box3-list');
                if (box3List && data.box3?.list) {
                    box3List.innerHTML = '';
                    data.box3.list.split('\n').filter(p => p.trim() !== '').forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        box3List.appendChild(li);
                    });
                }
                
                // Box 4
                const box4Title = document.getElementById('about-us-box4-title');
                if (box4Title && data.box4?.title) box4Title.textContent = data.box4.title;
                
                const box4Text = document.getElementById('about-us-box4-text');
                if (box4Text && data.box4?.text) {
                    box4Text.innerHTML = '';
                    data.box4.text.split('\n').filter(p => p.trim() !== '').forEach(item => {
                        const p = document.createElement('p');
                        p.innerHTML = item; // Using innerHTML to allow tags like <span class="highlight-text">
                        box4Text.appendChild(p);
                    });
                }
            }

            // ── Story Section (index.html only) ───────────────────────────
            const storySection = document.getElementById('dynamic-story-section');
            if (storySection && config.storySection) {
                if (config.storySection.isVisible === false) {
                    storySection.style.display = 'none';
                } else {
                    storySection.style.display = 'block';
                    
                    const isMobile = window.innerWidth <= 768;
                    const imageUrl = (isMobile && config.storySection.imageMobile) 
                        ? config.storySection.imageMobile 
                        : (config.storySection.imageDesktop || 'images/about.jpg');
                        
                    // Convert newlines to paragraphs
                    const textHtml = config.storySection.text 
                        ? config.storySection.text.split('\n').filter(p => p.trim() !== '').map(p => 
                            `<p style="font-family: 'Lora', serif; font-size: 1.15rem; color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.8;">${p}</p>`
                        ).join('')
                        : '';

                    let titleHtml = '';
                    if (config.storySection.mainTitle) {
                        const parts = config.storySection.mainTitle.split(' ');
                        const lastWord = parts.length > 1 ? parts.pop() : '';
                        const rest = parts.join(' ');
                        
                        titleHtml = `<h3 style="font-family: 'Cinzel', serif; font-size: 2.5rem; margin-bottom: 1.5rem;">
                            ${rest} ${lastWord ? `<span class="gold-text">${lastWord}</span>` : ''}
                        </h3>`;
                    }

                    storySection.innerHTML = `
                        <div class="container">
                            <div class="section-slide-header text-center fade-in visible">
                                <div class="slide-num">${config.storySection.sectionName || '01 // THE STORY'}</div>
                                <h2 class="slide-subtitle">${config.storySection.subtitle || 'Meet Bhupesh Dave'}</h2>
                            </div>
                            <div class="academy-container">
                                <div class="academy-image-wrapper fade-in visible">
                                    <img src="${imageUrl}?v=${new Date().getTime()}" alt="Mr. B Indian Mentalist performing mind reading" class="academy-img image-frame-glow" style="width: 100%; border-radius: 8px;" onerror="this.src='images/hero.jpg'">
                                </div>
                                <div class="fade-in visible">
                                    ${titleHtml}
                                    ${textHtml}
                                    ${config.storySection.btnText ? `<a href="${config.storySection.btnLink || '/contact'}" class="btn btn-primary">${config.storySection.btnText}</a>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            // ── Expertise Section (index.html only) ───────────────────────
            const expertiseSection = document.getElementById('dynamic-expertise-section');
            if (expertiseSection && config.expertiseSection) {
                if (config.expertiseSection.isVisible === false || !config.expertiseSection.cards || config.expertiseSection.cards.filter(c => !c.hidden).length === 0) {
                    expertiseSection.style.display = 'none';
                } else {
                    expertiseSection.style.display = 'block';
                    const visibleCards = config.expertiseSection.cards.filter(c => !c.hidden);
                    
                    let cardsHtml = '';
                    visibleCards.forEach((card, index) => {
                        const cardIndex = String(index + 1).padStart(2, '0');
                        cardsHtml += `
                            <div class="pillar-card ${card.colorClass || 'bg-pillar-burgundy'}">
                                <div class="pillar-top">
                                    <div class="pillar-index">${cardIndex}</div>
                                    <h3 class="pillar-title">${card.title || ''}</h3>
                                    <div class="pillar-days">${card.days || ''}</div>
                                </div>
                                <div class="pillar-body">
                                    <div class="pillar-divider"></div>
                                    <p class="pillar-desc">${card.desc || ''}</p>
                                    <div class="pillar-tags">${card.tags || ''}</div>
                                </div>
                                <div class="pillar-audience">${card.audience || ''}</div>
                            </div>
                        `;
                    });

                    expertiseSection.innerHTML = `
                        <div class="container">
                            <div class="section-slide-header text-center fade-in visible">
                                <div class="slide-num">${config.expertiseSection.sectionName || '02 // EXPERTISE'}</div>
                                <h2 class="slide-subtitle">${config.expertiseSection.subtitle || 'Services Offered'}</h2>
                            </div>
                            <div class="pillars-grid fade-in visible">
                                ${cardsHtml}
                            </div>
                        </div>
                    `;
                }
            }

            // ── Event Promo Section (index.html only) ─────────────────────
            const promoSection = document.getElementById('promo-section');
            if (promoSection && config.promoSection) {
                if (config.promoSection.isVisible === false) {
                    promoSection.style.display = 'none';
                } else {
                    promoSection.style.display = 'block';
                    
                    const elArtistSectionTitle = document.getElementById('promo-artist-section-title');
                    const elArtistsContainer = document.getElementById('promo-artists-container');
                    const elAddressTitle = document.getElementById('promo-address-title');
                    const elAddressText = document.getElementById('promo-address-text');
                    const elAttendTitle = document.getElementById('promo-attend-title');
                    const elAttendList = document.getElementById('promo-attend-list');
                    const elAboutTitle = document.getElementById('promo-about-title');
                    const elAboutDesc = document.getElementById('promo-about-desc');
                    const elBtn = document.getElementById('promo-btn');
                    
                    if (elArtistSectionTitle && config.promoSection.artistSectionTitle) elArtistSectionTitle.textContent = config.promoSection.artistSectionTitle;
                    
                    if (elArtistsContainer && config.promoSection.artists && config.promoSection.artists.length > 0) {
                        elArtistsContainer.innerHTML = '';
                        config.promoSection.artists.forEach(artist => {
                            const profileDiv = document.createElement('div');
                            profileDiv.className = 'artist-profile';
                            profileDiv.innerHTML = `
                                <img src="${artist.image || 'images/hero.jpg'}" alt="${artist.name || 'Artist'} - Mentalist" class="artist-avatar" onerror="this.src='images/hero.jpg'">
                                <span class="artist-name">${artist.name || ''}</span>
                            `;
                            elArtistsContainer.appendChild(profileDiv);
                        });
                    }
                    
                    if (elAddressTitle && config.promoSection.addressTitle) elAddressTitle.textContent = config.promoSection.addressTitle;
                    if (elAddressText && config.promoSection.addressText) elAddressText.textContent = config.promoSection.addressText;
                    if (elAttendTitle && config.promoSection.attendTitle) elAttendTitle.textContent = config.promoSection.attendTitle;
                    if (elAboutTitle && config.promoSection.aboutTitle) elAboutTitle.textContent = config.promoSection.aboutTitle;
                    if (elAboutDesc && config.promoSection.aboutDesc) elAboutDesc.textContent = config.promoSection.aboutDesc;
                    
                    if (elAttendList && config.promoSection.attendList) {
                        elAttendList.innerHTML = ''; // safely building elements
                        const items = config.promoSection.attendList.split('\n').filter(i => i.trim() !== '');
                        items.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            elAttendList.appendChild(li);
                        });
                    }
                    
                    if (elBtn) {
                        if (config.promoSection.btnText) elBtn.textContent = config.promoSection.btnText;
                        if (config.promoSection.btnLink) elBtn.href = config.promoSection.btnLink;
                    }
                }
            }

            // ── Stats Bar ─────────────────────────────────────────────────
            const dynamicStatsSection = document.getElementById('dynamic-stats-section');
            const statsGrid = document.getElementById('dynamic-stats-grid');
            if (dynamicStatsSection && statsGrid) {
                if (config.statsSection && config.statsSection.isVisible === false) {
                    dynamicStatsSection.style.display = 'none';
                } else {
                    dynamicStatsSection.style.display = 'block';
                    const statsData = (config.statsSection && config.statsSection.stats) ? config.statsSection.stats : [
                        { number: "10", suffix: "+", text: "Years Experience", color: "#8B1E32" },
                        { number: "500", suffix: "+", text: "Shows Worldwide", color: "#4B296B" },
                        { number: "50000", suffix: "k+", text: "Minds Astonished", color: "#006D77" },
                        { number: "100", suffix: "%", text: "Unforgettable", color: "#D4AF37" }
                    ];
                    
                    statsGrid.innerHTML = '';
                    statsData.forEach(stat => {
                        const block = document.createElement('div');
                        block.className = 'stat-block';
                        block.style.backgroundColor = stat.color || '#000';
                        block.innerHTML = `
                            <div class="stat-num" data-target="${stat.number}" data-suffix="${stat.suffix}">0${stat.suffix}</div>
                            <div class="stat-txt">${stat.text}</div>
                        `;
                        statsGrid.appendChild(block);
                    });
                    
                    if (typeof window.initStatsAnimation === 'function') {
                        window.initStatsAnimation();
                    }
                }
            }

            // ── Clients / Brands ──────────────────────────────────────────
            const clientsSection = document.getElementById('dynamic-clients-section');
            if (clientsSection) {
                if (config.showClientsSection === false || !config.clients || config.clients.filter(c => !c.hidden).length === 0) {
                    clientsSection.style.display = 'none';
                } else {
                    clientsSection.style.display = 'block';
                    const visibleClients = config.clients.filter(c => !c.hidden);
                    const sectionTitle = config.clientsSectionTitle || "Our happy and satisfied Clients :";
                    
                    let cardsHtml = '';
                    visibleClients.forEach(client => {
                        cardsHtml += `
                            <div class="client-card">
                                <div class="client-logo-wrapper">
                                    <img src="${client.logoUrl}" alt="${client.name} - Mr. B Client" class="client-logo" loading="lazy">
                                </div>
                                <div class="client-name">${client.name}</div>
                            </div>
                        `;
                    });

                    // Pure CSS marquee — no JS scroll, no lag, GPU-accelerated
                    const clientsHtml = `
                        <div class="container" style="max-width: 100%; padding: 0;">
                            <div class="section-slide-header text-center fade-in visible">
                                <div class="slide-num">05 // TRUSTED BY</div>
                                <h2 class="slide-subtitle">${sectionTitle}</h2>
                            </div>
                            <div class="marquee-container fade-in visible">
                                <div class="marquee-track" id="marquee-track">
                                    <div class="marquee-group">${cardsHtml}</div>
                                    <div class="marquee-group" aria-hidden="true">${cardsHtml}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    clientsSection.innerHTML = clientsHtml;

                    // Touch/drag scroll support
                    const track = clientsSection.querySelector('.marquee-track');
                    if (track) {
                        let isDragging = false;
                        let startX = 0;
                        let currentOffset = 0;
                        let animOffset = 0;

                        const getTranslateX = (el) => {
                            const style = window.getComputedStyle(el);
                            const matrix = new DOMMatrix(style.transform);
                            return matrix.m41;
                        };

                        const pauseAnim = () => {
                            animOffset = getTranslateX(track);
                            track.style.animationPlayState = 'paused';
                            track.style.transform = `translateX(${animOffset}px)`;
                            track.style.animation = 'none';
                        };

                        const resumeAnim = () => {
                            // Calculate % progress to resume animation at correct point
                            const halfW = track.scrollWidth / 2;
                            const pct = (Math.abs(currentOffset) % halfW) / halfW;
                            const dur = 40; // seconds
                            track.style.transform = '';
                            track.style.animation = `marquee-scroll ${dur}s linear infinite`;
                            track.style.animationDelay = `-${pct * dur}s`;
                        };

                        // Mouse drag
                        track.addEventListener('mousedown', (e) => {
                            isDragging = true;
                            startX = e.clientX;
                            pauseAnim();
                            currentOffset = animOffset;
                            track.style.cursor = 'grabbing';
                        });
                        window.addEventListener('mousemove', (e) => {
                            if (!isDragging) return;
                            const dx = e.clientX - startX;
                            currentOffset = animOffset + dx;
                            track.style.transform = `translateX(${currentOffset}px)`;
                        });
                        window.addEventListener('mouseup', () => {
                            if (!isDragging) return;
                            isDragging = false;
                            track.style.cursor = '';
                            resumeAnim();
                        });

                        // Touch drag
                        track.addEventListener('touchstart', (e) => {
                            startX = e.touches[0].clientX;
                            pauseAnim();
                            currentOffset = animOffset;
                        }, { passive: true });
                        track.addEventListener('touchmove', (e) => {
                            const dx = e.touches[0].clientX - startX;
                            currentOffset = animOffset + dx;
                            track.style.transform = `translateX(${currentOffset}px)`;
                        }, { passive: true });
                        track.addEventListener('touchend', () => {
                            resumeAnim();
                        }, { passive: true });

                        // ── Center Spotlight (auto-highlight nearest card) ──
                        const container = clientsSection.querySelector('.marquee-container');
                        let rafId = null;

                        const updateSpotlight = () => {
                            const cards = container.querySelectorAll('.client-card');
                            const containerRect = container.getBoundingClientRect();
                            const centerX = containerRect.left + containerRect.width / 2;

                            let closestCard = null;
                            let closestDist = Infinity;

                            cards.forEach(card => {
                                const rect = card.getBoundingClientRect();
                                const cardCenterX = rect.left + rect.width / 2;
                                const dist = Math.abs(cardCenterX - centerX);
                                if (dist < closestDist) {
                                    closestDist = dist;
                                    closestCard = card;
                                }
                            });

                            cards.forEach(card => card.classList.remove('is-center'));
                            if (closestCard) closestCard.classList.add('is-center');

                            rafId = requestAnimationFrame(updateSpotlight);
                        };

                        // Only run rAF when section is visible (saves CPU)
                        const sectionObserver = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    if (!rafId) rafId = requestAnimationFrame(updateSpotlight);
                                } else {
                                    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                                    container.querySelectorAll('.client-card').forEach(c => c.classList.remove('is-center'));
                                }
                            });
                        }, { threshold: 0.1 });
                        sectionObserver.observe(clientsSection);
                    }
                }
            }

            // ── Social Media Links ──────────────────────────────────────────
            const socialLinksContainer = document.getElementById('dynamic-social-links');
            if (socialLinksContainer && config.socialMedia && config.socialMedia.length > 0) {
                socialLinksContainer.innerHTML = '';
                config.socialMedia.forEach(social => {
                    const a = document.createElement('a');
                    a.href = social.url;
                    a.setAttribute('aria-label', social.label);
                    // Add target and rel for external links
                    if (!social.url.startsWith('mailto:') && !social.url.startsWith('tel:')) {
                        a.target = '_blank';
                        a.rel = 'noopener';
                    }
                    a.innerHTML = `<i class="${social.icon}"></i>`;
                    socialLinksContainer.appendChild(a);
                });
            }
            // ── Dynamic Contact Info (contact.html only) ───────────────────────
            const dynamicContactInfo = document.getElementById('dynamic-contact-info');
            if (dynamicContactInfo) {
                let contactHtml = '';
                if (config.contactInfo && Array.isArray(config.contactInfo)) {
                    config.contactInfo.forEach(item => {
                        let textHtml = item.content ? item.content.replace(/\n/g, '<br>') : '';
                        if (item.link) {
                            textHtml = `<a href="${item.link}">${textHtml}</a>`;
                        }
                        contactHtml += `
                            <div class="info-strip-item">
                                <div class="icon-glow-box"><i class="${item.icon}"></i></div>
                                <div>
                                    <h4>${item.title}</h4>
                                    <p>${textHtml}</p>
                                </div>
                            </div>
                        `;
                    });
                }

                // Append Social Media Block
                if (config.socialMedia && config.socialMedia.length > 0) {
                    let socialLinksHtml = '';
                    config.socialMedia.forEach(social => {
                        const isExternal = !social.url.startsWith('mailto:') && !social.url.startsWith('tel:');
                        const targetRel = isExternal ? 'target="_blank" rel="noopener"' : '';
                        socialLinksHtml += `<a href="${social.url}" class="social-circle" aria-label="${social.label}" ${targetRel}><i class="${social.icon}"></i></a>`;
                    });
                    
                    contactHtml += `
                        <div class="info-strip-item">
                            <div class="icon-glow-box"><i class="fa-solid fa-share-nodes"></i></div>
                            <div>
                                <h4>Follow Mr. B</h4>
                                <div class="social-icons-inline" id="contact-social-links">
                                    ${socialLinksHtml}
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                dynamicContactInfo.innerHTML = contactHtml;
            }

            // ── Shorts / Videos (Home & Contact pages) ────────────────────
            if (config.shorts && Array.isArray(config.shorts)) {
                // Home page
                const homeShortsContainer = document.getElementById('dynamic-shorts-home');
                if (homeShortsContainer) {
                    const homeShorts = config.shorts.filter(s => !(s.hideHome || s.hidden === true));
                    if (homeShorts.length === 0) {
                        homeShortsContainer.style.display = 'none';
                    } else {
                        homeShortsContainer.style.display = 'flex';
                        homeShortsContainer.innerHTML = homeShorts.map(short => `
                            <div class="video-wrapper image-frame-glow">
                                <iframe width="100%" height="315"
                                    src="${short.url}"
                                    title="YouTube video player" frameborder="0"
                                    allowfullscreen loading="lazy"
                                    sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
                            </div>
                        `).join('');
                    }
                }

                // Contact page
                const contactShortsContainer = document.getElementById('dynamic-shorts-contact');
                if (contactShortsContainer) {
                    const shortsSection = contactShortsContainer.closest('.contact-shorts-section');
                    const contactShorts = config.shorts.filter(s => !(s.hideContact || s.hidden === true));
                    if (contactShorts.length === 0) {
                        if (shortsSection) shortsSection.style.display = 'none';
                    } else {
                        if (shortsSection) shortsSection.style.display = 'flex';
                        contactShortsContainer.style.display = 'flex';
                        contactShortsContainer.innerHTML = contactShorts.map(short => `
                            <div class="video-wrapper">
                                <iframe src="${short.url}"
                                    title="YouTube video player" frameborder="0"
                                    allowfullscreen loading="lazy"
                                    sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
                            </div>
                        `).join('');
                    }
                }
            }

            // ── Dynamic CTA Section ("Ready for the Impossible?") ─────────
            const ctaSection = document.getElementById('dynamic-cta-section');
            if (ctaSection && config.ctaSection) {
                if (config.ctaSection.isVisible === false) {
                    ctaSection.style.display = 'none';
                } else {
                    ctaSection.style.display = 'block';
                    const ctaTitle = document.getElementById('cta-dynamic-title');
                    const ctaDesc = document.getElementById('cta-dynamic-desc');
                    const ctaBtn = document.getElementById('cta-dynamic-btn');

                    if (ctaTitle) {
                        const reg = config.ctaSection.titleRegular || 'Ready for the';
                        const gold = config.ctaSection.titleGold || 'Impossible?';
                        ctaTitle.innerHTML = `${reg} ${gold ? `<span class="gold-text">${gold}</span>` : ''}`;
                    }
                    if (ctaDesc && config.ctaSection.description) {
                        ctaDesc.textContent = config.ctaSection.description;
                    }
                    if (ctaBtn) {
                        if (config.ctaSection.btnText) ctaBtn.textContent = config.ctaSection.btnText;
                        if (config.ctaSection.btnLink) ctaBtn.href = config.ctaSection.btnLink;
                    }
                }
            }

            // ── Dynamic Quotes Section (GLIMPSES) ──────────────────────────
            const quotesContainer = document.getElementById('dynamic-quotes-container');
            const slidesContainer = document.getElementById('quotes-slides-container');
            const controlsContainer = document.getElementById('quotes-controls-container');

            if (quotesContainer && config.quotesSection) {
                if (config.quotesSection.isVisible === false || !config.quotesSection.quotes) {
                    quotesContainer.style.display = 'none';
                } else {
                    const activeQuotes = config.quotesSection.quotes.filter(q => !q.hidden);
                    if (activeQuotes.length === 0) {
                        quotesContainer.style.display = 'none';
                    } else {
                        quotesContainer.style.display = 'block';

                        // Render slides
                        if (slidesContainer) {
                            slidesContainer.innerHTML = activeQuotes.map((q, idx) => `
                                <div class="quote-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                                    <div class="quote-card-styled">
                                        <i class="fa-solid fa-quote-left quote-icon-gold"></i>
                                        <div class="quote-text-content">"${q.quote}"</div>
                                        <div class="quote-author-info">
                                            <div class="quote-author-name">${q.author || ''}</div>
                                            <div class="quote-author-role">${q.role || ''}</div>
                                        </div>
                                    </div>
                                </div>
                            `).join('');
                        }

                        // Render controls if more than 1 quote
                        if (controlsContainer && activeQuotes.length > 1) {
                            const dotsHtml = activeQuotes.map((_, idx) => `
                                <span class="quote-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
                            `).join('');

                            controlsContainer.innerHTML = `
                                <button class="quote-nav-btn quote-prev-btn" aria-label="Previous quote"><i class="fa-solid fa-chevron-left"></i></button>
                                <div class="quote-dots">${dotsHtml}</div>
                                <button class="quote-nav-btn quote-next-btn" aria-label="Next quote"><i class="fa-solid fa-chevron-right"></i></button>
                            `;

                            // Slider State & Controller
                            let currentQuoteIndex = 0;
                            let quoteTimer = null;

                            const goToQuote = (newIndex) => {
                                const slides = slidesContainer.querySelectorAll('.quote-slide');
                                const dots = controlsContainer.querySelectorAll('.quote-dot');

                                if (slides.length === 0) return;

                                slides[currentQuoteIndex].classList.remove('active');
                                if (dots[currentQuoteIndex]) dots[currentQuoteIndex].classList.remove('active');

                                currentQuoteIndex = (newIndex + slides.length) % slides.length;

                                slides[currentQuoteIndex].classList.add('active');
                                if (dots[currentQuoteIndex]) dots[currentQuoteIndex].classList.add('active');
                            };

                            const startAutoRotate = () => {
                                stopAutoRotate();
                                quoteTimer = setInterval(() => {
                                    goToQuote(currentQuoteIndex + 1);
                                }, 6500); // Rotate every 6.5s
                            };

                            const stopAutoRotate = () => {
                                if (quoteTimer) clearInterval(quoteTimer);
                            };

                            // Event Listeners for Prev/Next and Dots
                            const prevBtn = controlsContainer.querySelector('.quote-prev-btn');
                            const nextBtn = controlsContainer.querySelector('.quote-next-btn');
                            const dots = controlsContainer.querySelectorAll('.quote-dot');

                            if (prevBtn) {
                                prevBtn.addEventListener('click', () => {
                                    goToQuote(currentQuoteIndex - 1);
                                    startAutoRotate();
                                });
                            }
                            if (nextBtn) {
                                nextBtn.addEventListener('click', () => {
                                    goToQuote(currentQuoteIndex + 1);
                                    startAutoRotate();
                                });
                            }
                            dots.forEach(dot => {
                                dot.addEventListener('click', () => {
                                    const idx = parseInt(dot.getAttribute('data-index'), 10);
                                    goToQuote(idx);
                                    startAutoRotate();
                                });
                            });

                            // Pause auto rotate on hover over card
                            if (slidesContainer) {
                                slidesContainer.addEventListener('mouseenter', stopAutoRotate);
                                slidesContainer.addEventListener('mouseleave', startAutoRotate);
                            }

                            // Start timer
                            startAutoRotate();
                        } else if (controlsContainer) {
                            controlsContainer.innerHTML = '';
                        }
                    }
                }
            }

            // ── Dynamic Area of Interest Options ───────────────────────
            const interestOptionsList = document.querySelector('#interest-dropdown .custom-dropdown-options');
            if (interestOptionsList && config.areaOfInterests && config.areaOfInterests.length > 0) {
                interestOptionsList.innerHTML = config.areaOfInterests.map(opt => `
                    <li data-value="${opt.value}">${opt.label}</li>
                `).join('');

                // Re-bind option click listeners
                const dropdown = document.getElementById('interest-dropdown');
                const selectedText = document.getElementById('interest-selected-text');
                const hiddenInput = document.getElementById('interest');
                const options = interestOptionsList.querySelectorAll('li');

                options.forEach(option => {
                    option.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const value = this.getAttribute('data-value');
                        const text = this.innerText;
                        if (selectedText) selectedText.innerText = text;
                        if (hiddenInput) hiddenInput.value = value;
                        if (dropdown) dropdown.classList.remove('active');
                    });
                });
            }
        })
        .catch(err => {
            console.log("Config load error:", err);
        });

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
                                    <img src="${event.image_url}" alt="${event.image_alt || event.title} - Mr. B Event" class="event-img" onerror="this.onerror=null; this.src='images/hero.jpg'">
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

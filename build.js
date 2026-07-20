const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const configPath = path.join(__dirname, 'data', 'siteConfig.json');
let config;
try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configData);
} catch (error) {
    console.error('Failed to read or parse siteConfig.json:', error);
    process.exit(1);
}

// Helper to update elements safely
function setText($, selector, text) {
    if ($(selector).length > 0 && text) {
        $(selector).text(text);
    }
}

function setHtml($, selector, html) {
    if ($(selector).length > 0 && html) {
        $(selector).html(html);
    }
}

// 1. Process index.html
try {
    const indexPath = path.join(__dirname, 'index.html');
    let indexHtml = fs.readFileSync(indexPath, 'utf-8');
    const $ = cheerio.load(indexHtml);

    // About Section
    if (config.aboutSection) {
        setText($, '#about-dynamic-tag', config.aboutSection.tag);
        setText($, '#about-dynamic-desc', config.aboutSection.description);
        
        const regText = config.aboutSection.titleRegular || '';
        const goldText = config.aboutSection.titleGold || '';
        
        let titleHtml = regText;
        if (goldText) {
            titleHtml += ` <span class="gold-text">${goldText}</span>`;
        }
        setHtml($, '#about-dynamic-title', titleHtml);
        
        const btnEl = $('#about-dynamic-btn');
        if (btnEl.length > 0) {
            if (config.aboutSection.btnText) btnEl.text(config.aboutSection.btnText);
            if (config.aboutSection.btnLink) btnEl.attr('href', config.aboutSection.btnLink);
        }
    }

    // Story Section
    if (config.storySection && config.storySection.isVisible !== false) {
        // Build the story HTML block. This matches what script.js does.
        let textHtml = '';
        if (config.storySection.text) {
            const lines = config.storySection.text.split('\\n');
            lines.forEach(line => {
                if (line.trim() !== '') {
                    textHtml += `<p style="font-family: 'Lora', serif; font-size: 1.15rem; color: var(--text-light); line-height: 1.7; margin-bottom: 1.5rem;">${line}</p>`;
                }
            });
        }
        
        const storyHtml = `
            <div class="container">
                <div class="story-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                    <div class="story-image-container fade-in">
                        <img src="${config.storySection.imageDesktop || 'images/about.jpg'}" alt="Mr. B Indian Mentalist performing mind reading" class="story-image" style="width: 100%; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                    </div>
                    <div class="story-content fade-in">
                        <div class="section-slide-header">
                            <div class="slide-num">${config.storySection.sectionName || ''}</div>
                            <h2 class="slide-subtitle">${config.storySection.subtitle || ''}</h2>
                        </div>
                        <h3 style="font-family: 'Cinzel', serif; font-size: 2.5rem; color: var(--gold); margin-bottom: 2rem;">${config.storySection.mainTitle || ''}</h3>
                        ${textHtml}
                        <div style="margin-top: 3rem;">
                            <a href="${config.storySection.btnLink || '#'}" class="btn btn-gold">${config.storySection.btnText || 'Read More'}</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        setHtml($, '#dynamic-story-section', storyHtml);
        $('#dynamic-story-section').css('display', 'block');
    }

    // Promo Section
    if (config.promoSection) {
        setText($, '#promo-artist-section-title', config.promoSection.artistSectionTitle);
        setText($, '#promo-address-title', config.promoSection.addressTitle);
        setText($, '#promo-address-text', config.promoSection.addressText);
        setText($, '#promo-attend-title', config.promoSection.attendTitle);
        setText($, '#promo-about-title', config.promoSection.aboutTitle);
        setText($, '#promo-about-desc', config.promoSection.aboutDesc);
        
        const promoBtn = $('#promo-btn');
        if (promoBtn.length > 0) {
            if (config.promoSection.btnText) promoBtn.text(config.promoSection.btnText);
            if (config.promoSection.btnLink) promoBtn.attr('href', config.promoSection.btnLink);
        }

        if (config.promoSection.attendList) {
            let listHtml = '';
            config.promoSection.attendList.split('\\n').filter(p => p.trim() !== '').forEach(item => {
                listHtml += `<li>${item}</li>`;
            });
            setHtml($, '#promo-attend-list', listHtml);
        }

        if (config.promoSection.artists && config.promoSection.artists.length > 0) {
            let artistsHtml = '';
            config.promoSection.artists.forEach(artist => {
                artistsHtml += `
                    <div class="artist-profile">
                        <img src="${artist.image}" alt="${artist.name} - Mr. B" class="artist-avatar" onerror="this.src='images/hero.jpg'">
                        <span class="artist-name">${artist.name}</span>
                    </div>
                `;
            });
            setHtml($, '#promo-artists-container', artistsHtml);
        }
    }

    // Clients Section (Marquee)
    if (config.clientsSectionTitle) {
        // Only doing the title, as the scrolling marquee is purely visual/CSS and JS handled, but we can inject logos for SEO
        let clientsHtml = `
            <div class="container text-center">
                <h2 style="font-family: 'Cinzel', serif; font-size: 2.5rem; margin-bottom: 3rem;">${config.clientsSectionTitle}</h2>
                <div class="brand-marquee-container">
                    <div class="brand-marquee-track">
        `;
        
        if (config.clients && config.clients.length > 0) {
            const visibleClients = config.clients.filter(c => !c.hidden);
            // Add them twice for the marquee effect if needed, but for SEO once is enough. We add twice to match UI.
            const buildLogos = () => {
                let html = '';
                visibleClients.forEach(client => {
                    html += `
                        <div class="brand-marquee-item">
                            <img src="${client.logoUrl}" alt="${client.name} - Mr. B Client">
                        </div>
                    `;
                });
                return html;
            };
            clientsHtml += buildLogos() + buildLogos();
        }
        
        clientsHtml += `
                    </div>
                </div>
            </div>
        `;
        setHtml($, '#dynamic-clients-section', clientsHtml);
        $('#dynamic-clients-section').css('display', 'block');
    }

    fs.writeFileSync(indexPath, $.html());
    console.log('Successfully pre-rendered index.html');
} catch (error) {
    console.error('Error processing index.html:', error);
}

// 2. Process about.html
try {
    const aboutPath = path.join(__dirname, 'about.html');
    let aboutHtml = fs.readFileSync(aboutPath, 'utf-8');
    const $ = cheerio.load(aboutHtml);

    if (config.aboutUsPage) {
        const data = config.aboutUsPage;
        
        setText($, '#about-us-hero-subtitle', data.heroSubtitle);
        
        // Box 1
        if (data.box1) {
            setText($, '#about-us-box1-title', data.box1.title);
            setText($, '#about-us-box1-highlight', data.box1.highlight);
            if (data.box1.list) {
                let listHtml = '';
                data.box1.list.split('\\n').filter(p => p.trim() !== '').forEach(item => {
                    listHtml += `<li>${item}</li>`;
                });
                setHtml($, '#about-us-box1-list', listHtml);
            }
        }
        
        // Box 2
        if (data.box2) {
            setText($, '#about-us-box2-title', data.box2.title);
            if (data.box2.text) {
                let textHtml = '';
                data.box2.text.split('\\n').filter(p => p.trim() !== '').forEach(item => {
                    textHtml += `<p>${item}</p>`;
                });
                setHtml($, '#about-us-box2-text', textHtml);
            }
        }

        // Box 3
        if (data.box3) {
            setText($, '#about-us-box3-title', data.box3.title);
            if (data.box3.list) {
                let listHtml = '';
                data.box3.list.split('\\n').filter(p => p.trim() !== '').forEach(item => {
                    listHtml += `<li>${item}</li>`;
                });
                setHtml($, '#about-us-box3-list', listHtml);
            }
        }

        // Box 4
        if (data.box4) {
            setText($, '#about-us-box4-title', data.box4.title);
            if (data.box4.text) {
                let textHtml = '';
                data.box4.text.split('\\n').filter(p => p.trim() !== '').forEach(item => {
                    textHtml += `<p>${item}</p>`;
                });
                setHtml($, '#about-us-box4-text', textHtml);
            }
        }
    }

    fs.writeFileSync(aboutPath, $.html());
    console.log('Successfully pre-rendered about.html');
} catch (error) {
    console.error('Error processing about.html:', error);
}

// Note: Components like header/footer are injected via components.js. 
// For perfect SEO, we might want to inject those too, but this covers the dynamic JSON payload.

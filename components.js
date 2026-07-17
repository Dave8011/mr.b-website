const globalHeader = `
<header class="header">
    <div class="container nav-container">
        <a href="/" class="logo">
            <span class="gold-text">BHUPESH DAVE</span>
            <span class="sub-logo">MR. B · INDIAN SUPER BRAIN</span>
        </a>
        <nav class="nav-links">
            <a href="/" class="nav-link">Home</a>
            <a href="/about" class="nav-link">About Us</a>
            <a href="/contact" class="nav-link">Contact Us</a>
        </nav>
        <button class="mobile-nav-toggle" aria-label="Toggle Navigation">
            <i class="fa-solid fa-bars"></i>
        </button>
    </div>
</header>
`;

const globalFooter = `
<footer class="footer brand-footer slim-footer">
    <div class="gold-line-top"></div>
    <div class="container footer-container-slim">
        <div class="footer-brand">
            <h2 class="footer-logo">BHUPESH DAVE</h2>
            <p class="footer-tagline">MR. B · INDIAN SUPER BRAIN</p>
            <p style="margin-top: 1rem; font-size: 0.75rem; color: var(--text-muted); letter-spacing: 1px;">&copy; 2026 Bhupesh Dave. All Rights Reserved.</p>
        </div>
        
        <div class="footer-seo-links">
            <a href="/" class="seo-link">Home</a>
            <a href="/about" class="seo-link">About Us</a>
            <a href="/contact" class="seo-link">Contact Us</a>
            <a href="#" class="seo-link">Privacy Policy</a>
            <a href="#" class="seo-link">Terms of Service</a>
            <a href="/admin.html" class="seo-link"><i class="fa-solid fa-lock" style="font-size: 0.7rem; margin-right: 0.3rem;"></i>Admin</a>
        </div>
        
        <div class="footer-socials-slim">
            <a href="https://instagram.com/bhupeshdave._" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="http://bhupeshdave.com" target="_blank" rel="noopener" aria-label="Website"><i class="fa-solid fa-globe"></i></a>
            <a href="mailto:bhupeshdave@gmail.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
            <a href="tel:+919820038976" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>
        </div>
    </div>
</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
    // Inject Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = globalHeader;
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = globalFooter;
    }

    // Highlight active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile Navigation Menu Toggle
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
                if (mobileNavToggle.querySelector('i')) {
                    mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }
});

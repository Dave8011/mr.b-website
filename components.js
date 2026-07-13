const globalHeader = `
<header class="header">
    <div class="container nav-container">
        <a href="/" class="logo">
            <span class="gold-text">BHUPESH DAVE</span>
            <span class="sub-logo">MR. B · INDIAN SUPER BRAIN</span>
        </a>
        <nav class="nav-links">
            <a href="/contact" class="nav-link active">Contact Us</a>
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
});

// DOM Elements
const darkModeBtn = document.getElementById('darkmode-btn');
const body = document.body;
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const contactForm = document.getElementById('contact-form');
const clearFormBtn = document.getElementById('clear-form-btn');

// Utility Functions
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Dark Mode Toggle
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    darkModeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showNotification(isDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
}

darkModeBtn.addEventListener('click', toggleDarkMode);

// Clear Form Button
clearFormBtn.addEventListener('click', function() {
    contactForm.reset();
    showNotification('Form cleared!');
});

// Smooth scrolling and click-based active state for navigation links
const navLinks = document.querySelectorAll('nav ul li a');
const menuToggle = document.getElementById('check');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        navLinks.forEach(navLink => navLink.classList.remove('active'));
        this.classList.add('active');
        menuToggle.checked = false;

        if (targetId === '#home') {
            document.getElementById('home').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

navLinks[0]?.classList.add('active');

const sharedLightbox = document.createElement('div');
sharedLightbox.className = 'carousel-lightbox';
sharedLightbox.hidden = true;
sharedLightbox.setAttribute('role', 'dialog');
sharedLightbox.setAttribute('aria-modal', 'true');
sharedLightbox.setAttribute('aria-label', 'Expanded design image');
sharedLightbox.innerHTML = `
    <div class="carousel-lightbox-content">
        <img alt="">
    </div>
    <button class="carousel-lightbox-close" type="button" aria-label="Close expanded image">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
`;
document.body.appendChild(sharedLightbox);

const sharedLightboxImage = sharedLightbox.querySelector('img');
const sharedLightboxClose = sharedLightbox.querySelector('.carousel-lightbox-close');
let lightboxReturnFocus = null;

function closeSharedLightbox() {
    sharedLightbox.hidden = true;
    document.body.style.overflow = '';
    lightboxReturnFocus?.focus();
    lightboxReturnFocus = null;
}

function openSharedLightbox(slide) {
    const image = slide.querySelector('img');
    // Grid images are small previews; the lightbox loads the full-size file.
    sharedLightboxImage.src = image.dataset.full || image.src;
    sharedLightboxImage.alt = image.alt;
    lightboxReturnFocus = slide;
    sharedLightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    sharedLightboxClose.focus();
}

sharedLightboxClose.addEventListener('click', closeSharedLightbox);
sharedLightbox.addEventListener('click', (event) => {
    if (event.target === sharedLightbox) closeSharedLightbox();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !sharedLightbox.hidden) closeSharedLightbox();
});

// Email designs and static ads: each design opens in the shared lightbox.
document.querySelectorAll('.email-card, .ad-card').forEach((card) => {
    card.addEventListener('click', () => openSharedLightbox(card));
});

// Footer year stays current without editing the HTML.
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

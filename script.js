// DOM Elements
const darkModeBtn = document.getElementById('darkmode-btn');
const body = document.body;
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const aboutText = document.getElementById('about-text');
const editAboutBtn = document.getElementById('edit-btn');
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

// Edit About Section
function toggleAboutEdit() {
    const isEditing = aboutText.contentEditable === 'true';

    if (isEditing) {
        aboutText.contentEditable = 'false';
        editAboutBtn.textContent = 'Edit';
        showNotification('About section saved!');
    } else {
        aboutText.contentEditable = 'true';
        aboutText.focus();
        editAboutBtn.textContent = 'Save';
        showNotification('Edit mode enabled');
    }
}

if (editAboutBtn) {
    editAboutBtn.addEventListener('click', toggleAboutEdit);
}

// Skills Edit Functionality
for (let i = 1; i <= 4; i++) {
    const skillText = document.getElementById(`skill-text-${i}`);
    const editSkillBtn = document.getElementById(`edit-skill-${i}`);

    if (skillText && editSkillBtn) {
        editSkillBtn.addEventListener('click', () => {
            const isEditing = skillText.contentEditable === 'true';

            if (isEditing) {
                skillText.contentEditable = 'false';
                editSkillBtn.textContent = 'Edit';
                showNotification(`Skill ${i} saved!`);
            } else {
                skillText.contentEditable = 'true';
                editSkillBtn.textContent = 'Save';
                skillText.focus();
                showNotification('Edit mode enabled');
            }
        });
    }
}

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
sharedLightbox.setAttribute('aria-label', 'Expanded dashboard screen');
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
    carouselAutoplayResetters.forEach((resetTimer) => resetTimer());
    lightboxReturnFocus?.focus();
    lightboxReturnFocus = null;
}

function openSharedLightbox(slide) {
    const image = slide.querySelector('img');
    sharedLightboxImage.src = image.src;
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

let hoveredOrFocusedCarousel = null;
const carouselAutoplayResetters = new Set();

function initializeCarousel(carousel) {
    const slides = Array.from(carousel.querySelectorAll('.ui-slide'));
    const total = slides.length;
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const counter = carousel.querySelector('.carousel-counter');
    let dots = [];
    let currentIndex = 0;
    let startX = 0;
    let autoplayTimer = null;

    carousel.tabIndex = 0;
    dotsContainer.innerHTML = '';
    slides.forEach((slide, slideIndex) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Show dashboard screen ${slideIndex + 1}`);
        dot.dataset.carouselDot = String(slideIndex);
        dotsContainer.appendChild(dot);
    });
    dots = Array.from(dotsContainer.querySelectorAll('[data-carousel-dot]'));

    function getOffset(slideIndex) {
        let offset = slideIndex - currentIndex;
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;
        return offset;
    }

    function showSlide(index) {
        currentIndex = (index + total) % total;
        slides.forEach((slide, slideIndex) => {
            const offset = getOffset(slideIndex);
            const isActive = offset === 0;
            slide.dataset.offset = String(offset);
            slide.classList.toggle('is-active', isActive);
            slide.tabIndex = isActive ? 0 : -1;
            slide.setAttribute('aria-hidden', String(!isActive));
        });
        dots.forEach((dot, dotIndex) => {
            const active = dotIndex === currentIndex;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', String(active));
        });
        if (counter) {
            counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        }
    }

    function resetAutoplayTimer() {
        if (autoplayTimer !== null) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            if (sharedLightbox.hidden) showSlide(currentIndex + 1);
        }, 2500);
    }

    carouselAutoplayResetters.add(resetAutoplayTimer);

    carousel.addEventListener('mouseenter', () => { hoveredOrFocusedCarousel = carousel; });
    carousel.addEventListener('mouseleave', () => {
        if (hoveredOrFocusedCarousel === carousel && !carousel.contains(document.activeElement)) hoveredOrFocusedCarousel = null;
    });
    carousel.addEventListener('focusin', () => { hoveredOrFocusedCarousel = carousel; });
    carousel.addEventListener('focusout', () => {
        if (!carousel.matches(':hover') && hoveredOrFocusedCarousel === carousel) hoveredOrFocusedCarousel = null;
    });
    previousButton?.addEventListener('click', () => {
        resetAutoplayTimer();
        showSlide(currentIndex - 1);
    });
    nextButton?.addEventListener('click', () => {
        resetAutoplayTimer();
        showSlide(currentIndex + 1);
    });
    carousel.addEventListener('carousel-key-navigation', (event) => {
        resetAutoplayTimer();
        showSlide(currentIndex + event.detail);
    });
    dots.forEach((dot) => dot.addEventListener('click', () => {
        resetAutoplayTimer();
        showSlide(Number(dot.dataset.carouselDot));
    }));
    slides.forEach((slide, slideIndex) => {
        slide.addEventListener('click', () => {
            resetAutoplayTimer();
            if (slideIndex === currentIndex) openSharedLightbox(slide);
            else showSlide(slideIndex);
        });
        slide.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                resetAutoplayTimer();
                openSharedLightbox(slide);
            }
        });
    });
    carousel.addEventListener('touchstart', (event) => {
        hoveredOrFocusedCarousel = carousel;
        startX = event.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', (event) => {
        const distance = event.changedTouches[0].clientX - startX;
        if (Math.abs(distance) >= 40) {
            resetAutoplayTimer();
            showSlide(currentIndex + (distance < 0 ? 1 : -1));
        }
    }, { passive: true });

    showSlide(0);
    resetAutoplayTimer();
}

document.querySelectorAll('[data-carousel]').forEach(initializeCarousel);

document.addEventListener('keydown', (event) => {
    if (!hoveredOrFocusedCarousel || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    hoveredOrFocusedCarousel.dispatchEvent(new CustomEvent('carousel-key-navigation', { detail: direction }));
});

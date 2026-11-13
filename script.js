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

// Email designs: each full-length email opens in the shared lightbox.
document.querySelectorAll('.email-card').forEach((card) => {
    card.addEventListener('click', () => openSharedLightbox(card));
});

let hoveredOrFocusedCarousel = null;
const carouselAutoplayResetters = new Set();

// Remembers which carousel the arrow keys should control.
function trackCarouselHover(carousel) {
    carousel.addEventListener('mouseenter', () => { hoveredOrFocusedCarousel = carousel; });
    carousel.addEventListener('mouseleave', () => {
        if (hoveredOrFocusedCarousel === carousel && !carousel.contains(document.activeElement)) hoveredOrFocusedCarousel = null;
    });
    carousel.addEventListener('focusin', () => { hoveredOrFocusedCarousel = carousel; });
    carousel.addEventListener('focusout', () => {
        if (!carousel.matches(':hover') && hoveredOrFocusedCarousel === carousel) hoveredOrFocusedCarousel = null;
    });
}

function initializeCarousel(carousel) {
    const slides = Array.from(carousel.querySelectorAll('.ads-slide'));
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
        dot.setAttribute('aria-label', `Show design ${slideIndex + 1}`);
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

    trackCarouselHover(carousel);
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

// 3D ring carousel: cards stand in a circle and the whole ring rotates.
function initializeRingCarousel(carousel) {
    const originals = Array.from(carousel.querySelectorAll('.ads-slide'));
    const total = originals.length;
    if (total === 0) return;
    const track = originals[0].parentElement;
    track.classList.add('ring-track');
    originals.forEach((slide) => slide.classList.add('ring-card'));
    const counter = carousel.querySelector('.carousel-counter');
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    carousel.querySelector('.carousel-dots')?.remove();

    // Repeat the designs so a short list still forms a full ring.
    const MIN_FACES = 12;
    const copies = Math.max(1, Math.ceil(MIN_FACES / total));
    const faces = [...originals];
    for (let copy = 1; copy < copies; copy++) {
        originals.forEach((slide) => {
            const clone = slide.cloneNode(true);
            clone.querySelector('img').alt = '';
            track.appendChild(clone);
            faces.push(clone);
        });
    }

    const faceCount = faces.length;
    const angle = 360 / faceCount;
    let step = 0; // never wrapped, so the ring always turns the short way
    let radius = 0;
    let startX = 0;
    let autoplayTimer = null;

    const frontFace = () => ((step % faceCount) + faceCount) % faceCount;
    const pad = (value) => String(value).padStart(2, '0');

    function render() {
        track.style.transform = `translateY(-28px) translateZ(${-radius}px) rotateX(-8deg) rotateY(${-step * angle}deg)`;
        const front = frontFace();
        faces.forEach((face, faceIndex) => {
            const isFront = faceIndex === front;
            const facing = Math.cos(((faceIndex - step) * angle * Math.PI) / 180);
            face.style.setProperty('--facing', facing.toFixed(3));
            face.classList.toggle('is-active', isFront);
            face.tabIndex = isFront ? 0 : -1;
            face.setAttribute('aria-hidden', String(!isFront));
        });
        if (counter) counter.textContent = `${pad((front % total) + 1)} / ${pad(total)}`;
    }

    function layout() {
        const cardWidth = faces[0].offsetWidth;
        radius = Math.round(((cardWidth / 2) / Math.tan(Math.PI / faceCount)) * 1.12);
        faces.forEach((face, faceIndex) => {
            face.style.transform = `translate(-50%, -50%) rotateY(${faceIndex * angle}deg) translateZ(${radius}px)`;
        });
        render();
    }

    function rotateBy(delta) {
        step += delta;
        render();
    }

    function rotateToFace(faceIndex) {
        let delta = faceIndex - frontFace();
        if (delta > faceCount / 2) delta -= faceCount;
        if (delta < -faceCount / 2) delta += faceCount;
        rotateBy(delta);
    }

    function resetAutoplayTimer() {
        if (autoplayTimer !== null) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            if (sharedLightbox.hidden && hoveredOrFocusedCarousel !== carousel) rotateBy(1);
        }, 3000);
    }

    carouselAutoplayResetters.add(resetAutoplayTimer);
    trackCarouselHover(carousel);
    carousel.tabIndex = 0;

    previousButton?.addEventListener('click', () => { resetAutoplayTimer(); rotateBy(-1); });
    nextButton?.addEventListener('click', () => { resetAutoplayTimer(); rotateBy(1); });
    carousel.addEventListener('carousel-key-navigation', (event) => {
        resetAutoplayTimer();
        rotateBy(event.detail);
    });
    faces.forEach((face, faceIndex) => {
        face.addEventListener('click', () => {
            resetAutoplayTimer();
            if (faceIndex === frontFace()) openSharedLightbox(face);
            else rotateToFace(faceIndex);
        });
        face.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openSharedLightbox(face);
            }
        });
    });
    carousel.addEventListener('touchstart', (event) => {
        startX = event.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', (event) => {
        const distance = event.changedTouches[0].clientX - startX;
        if (Math.abs(distance) >= 40) {
            resetAutoplayTimer();
            rotateBy(distance < 0 ? 1 : -1);
        }
    }, { passive: true });

    window.addEventListener('resize', layout);
    layout();
    resetAutoplayTimer();
}

document.querySelectorAll('[data-carousel]:not([data-carousel-ring])').forEach(initializeCarousel);
document.querySelectorAll('[data-carousel-ring]').forEach(initializeRingCarousel);

document.addEventListener('keydown', (event) => {
    if (!hoveredOrFocusedCarousel || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    hoveredOrFocusedCarousel.dispatchEvent(new CustomEvent('carousel-key-navigation', { detail: direction }));
});

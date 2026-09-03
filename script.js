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

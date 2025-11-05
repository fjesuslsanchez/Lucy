// ===================================
// NAVIGATION
// ===================================

// Toggle mobile menu
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.nav-link, .btn-primary-nav').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    notificationText.textContent = message;
    notification.classList.add('show');

    if (type === 'error') {
        notification.style.background = '#e74c3c';
    } else {
        notification.style.background = 'var(--primary-color)';
    }

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]{10,}$/;
    return re.test(phone);
}

// Set minimum date for booking (today)
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Reservation form
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const prenom = document.getElementById('prenom').value.trim();
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const heure = document.getElementById('heure').value;
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!prenom || !nom) {
            showNotification('Veuillez entrer vos nom et prénom', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        if (!validatePhone(telephone)) {
            showNotification('Veuillez entrer un numéro de téléphone valide', 'error');
            return;
        }

        if (!service) {
            showNotification('Veuillez choisir un service', 'error');
            return;
        }

        if (!date || !heure) {
            showNotification('Veuillez choisir une date et une heure', 'error');
            return;
        }

        // Check if date is not in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showNotification('Vous ne pouvez pas réserver dans le passé', 'error');
            return;
        }

        // Prepare booking data
        const bookingData = {
            prenom,
            nom,
            email,
            telephone,
            service,
            date,
            heure,
            message
        };

        // In a real application, you would send this data to a server
        console.log('Booking data:', bookingData);

        // Simulate API call
        const submitButton = reservationForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;

        setTimeout(() => {
            // Success
            showNotification('Votre réservation a été envoyée avec succès ! Vous recevrez une confirmation par email.');
            reservationForm.reset();

            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Optional: Send email using EmailJS or similar service
            // You would need to implement this with your backend
            sendReservationEmail(bookingData);
        }, 2000);
    });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const nom = document.getElementById('contact-nom').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const sujet = document.getElementById('contact-sujet').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // Validation
        if (!nom) {
            showNotification('Veuillez entrer votre nom', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        if (!sujet) {
            showNotification('Veuillez entrer un sujet', 'error');
            return;
        }

        if (!message || message.length < 10) {
            showNotification('Votre message doit contenir au moins 10 caractères', 'error');
            return;
        }

        // Prepare contact data
        const contactData = {
            nom,
            email,
            sujet,
            message
        };

        // In a real application, you would send this data to a server
        console.log('Contact data:', contactData);

        // Simulate API call
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;

        setTimeout(() => {
            // Success
            showNotification('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            contactForm.reset();

            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Optional: Send email using EmailJS or similar service
            sendContactEmail(contactData);
        }, 2000);
    });
}

// ===================================
// EMAIL SENDING (Example with EmailJS)
// ===================================

/**
 * To implement email sending, you can use EmailJS (https://www.emailjs.com/)
 * 1. Sign up for a free account
 * 2. Create an email template
 * 3. Add your credentials below
 * 4. Uncomment the code and install EmailJS
 */

function sendReservationEmail(data) {
    // Example implementation with EmailJS
    /*
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_name: "Harmonie & Bien-Être",
        from_name: `${data.prenom} ${data.nom}`,
        from_email: data.email,
        phone: data.telephone,
        service: data.service,
        date: data.date,
        time: data.heure,
        message: data.message
    }).then(
        function(response) {
            console.log("Email sent successfully!", response);
        },
        function(error) {
            console.log("Email sending failed...", error);
        }
    );
    */

    console.log('Reservation email would be sent with data:', data);
}

function sendContactEmail(data) {
    // Example implementation with EmailJS
    /*
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_name: "Harmonie & Bien-Être",
        from_name: data.nom,
        from_email: data.email,
        subject: data.sujet,
        message: data.message
    }).then(
        function(response) {
            console.log("Email sent successfully!", response);
        },
        function(error) {
            console.log("Email sending failed...", error);
        }
    );
    */

    console.log('Contact email would be sent with data:', data);
}

// ===================================
// ANIMATIONS ON SCROLL
// ===================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards, tarif cards, testimonials, etc.
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .tarif-card, .temoignage-card, .galerie-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// GALERIE LIGHTBOX (Optional)
// ===================================

// If you add real images, you can implement a lightbox
const galerieItems = document.querySelectorAll('.galerie-item');

galerieItems.forEach(item => {
    item.addEventListener('click', () => {
        // You can implement a lightbox here
        // For example, using a library like GLightbox or creating a custom modal
        console.log('Gallery item clicked');
    });
});

// ===================================
// LOADING ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Format date to French format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Format phone number
function formatPhone(phone) {
    return phone.replace(/(\d{2})(?=\d)/g, '$1 ');
}

// Get service name in French
function getServiceName(serviceValue) {
    const services = {
        'massage-suedois': 'Massage Suédois',
        'massage-californien': 'Massage Californien',
        'massage-sportif': 'Massage Sportif',
        'pierres-chaudes': 'Massage aux Pierres Chaudes',
        'reflexologie': 'Réflexologie Plantaire',
        'olfactotherapie': 'Olfactothérapie'
    };
    return services[serviceValue] || serviceValue;
}

// ===================================
// BOOKING CALENDAR ENHANCEMENT
// ===================================

// Disable Sundays and past dates in calendar
if (dateInput) {
    dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();

        // Check if Sunday (0) or past date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dayOfWeek === 0) {
            showNotification('Le dimanche, nous sommes fermés. Veuillez choisir un autre jour.', 'error');
            this.value = '';
        }
    });
}

// ===================================
// SERVICE SELECTION HELPER
// ===================================

const serviceSelect = document.getElementById('service');
if (serviceSelect) {
    serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        console.log('Selected service:', getServiceName(selectedService));

        // You could add dynamic pricing or duration information here
        // based on the selected service
    });
}

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================

console.log('%c👋 Bienvenue sur Harmonie & Bien-Être!', 'color: #8B9D83; font-size: 20px; font-weight: bold;');
console.log('%cSite développé avec ❤️ pour votre bien-être', 'color: #D4A574; font-size: 14px;');

// ===================================
// KEYBOARD ACCESSIBILITY
// ===================================

// Add keyboard navigation for service cards
document.querySelectorAll('.service-card, .tarif-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = card.querySelector('.btn-link, .btn');
            if (link) {
                link.click();
            }
        }
    });
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy load images (if you add images later)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// ANALYTICS (Optional)
// ===================================

// Track button clicks
function trackEvent(category, action, label) {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);

    // If you use Google Analytics:
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    */
}

// Track reservation attempts
if (reservationForm) {
    reservationForm.addEventListener('submit', () => {
        trackEvent('Reservation', 'Submit', 'Reservation Form');
    });
}

// Track contact form submissions
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('Contact', 'Submit', 'Contact Form');
    });
}

// Track service card clicks
document.querySelectorAll('.service-card .btn-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const serviceName = e.target.closest('.service-card').querySelector('.service-title').textContent;
        trackEvent('Service', 'Click', serviceName);
    });
});

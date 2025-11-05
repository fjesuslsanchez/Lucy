// ===================================
// EMAILJS CONFIGURATION
// ===================================

/*
CONFIGURATION EMAILJS:

1. Créez un compte sur https://www.emailjs.com/
2. Créez un service email (Gmail, Outlook, etc.)
3. Créez des templates pour:
   - Confirmation de réservation
   - Rappel 24h avant
   - Newsletter

4. Remplacez les IDs ci-dessous par vos propres IDs:
*/

const EMAIL_CONFIG = {
    PUBLIC_KEY: 'VOTRE_PUBLIC_KEY',  // Remplacez par votre clé publique
    SERVICE_ID: 'VOTRE_SERVICE_ID', // Remplacez par votre ID de service
    TEMPLATES: {
        BOOKING_CONFIRMATION: 'template_booking',  // Template confirmation réservation
        BOOKING_REMINDER: 'template_reminder',    // Template rappel 24h avant
        NEWSLETTER: 'template_newsletter',         // Template newsletter
        CONTACT: 'template_contact'                // Template formulaire contact
    }
};

// Initialize EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.PUBLIC_KEY !== 'VOTRE_PUBLIC_KEY') {
        emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
        return true;
    }
    return false;
}

// Send booking confirmation email
async function sendBookingConfirmationEmail(bookingData) {
    if (!initEmailJS()) {
        console.log('EmailJS not configured. Email not sent.');
        return false;
    }

    try {
        const templateParams = {
            to_email: bookingData.email,
            to_name: `${bookingData.prenom} ${bookingData.nom}`,
            booking_id: bookingData.id,
            service: window.bookingSystem.getServiceName(bookingData.service),
            date: new Date(bookingData.date).toLocaleDateString('fr-FR'),
            time: bookingData.time,
            phone: bookingData.telephone,
            message: bookingData.message || 'Aucun message'
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATES.BOOKING_CONFIRMATION,
            templateParams
        );

        console.log('Booking confirmation email sent!', response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Send reminder email (to be called 24h before)
async function sendReminderEmail(bookingData) {
    if (!initEmailJS()) {
        console.log('EmailJS not configured. Email not sent.');
        return false;
    }

    try {
        const templateParams = {
            to_email: bookingData.email,
            to_name: `${bookingData.prenom} ${bookingData.nom}`,
            service: window.bookingSystem.getServiceName(bookingData.service),
            date: new Date(bookingData.date).toLocaleDateString('fr-FR'),
            time: bookingData.time
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATES.BOOKING_REMINDER,
            templateParams
        );

        console.log('Reminder email sent!', response);
        return true;
    } catch (error) {
        console.error('Error sending reminder:', error);
        return false;
    }
}

// Check for upcoming bookings and send reminders
function checkAndSendReminders() {
    const bookings = window.bookingSystem.getBookings();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowString = tomorrow.toISOString().split('T')[0];

    bookings.forEach(booking => {
        if (booking.status === 'confirmed' && booking.date === tomorrowString) {
            const reminderSent = localStorage.getItem(`reminder-sent-${booking.id}`);
            if (!reminderSent) {
                sendReminderEmail(booking);
                localStorage.setItem(`reminder-sent-${booking.id}`, 'true');
            }
        }
    });
}

// Run reminder check every hour
setInterval(checkAndSendReminders, 3600000);

// Initial check
setTimeout(checkAndSendReminders, 5000);

// ===================================
// NEWSLETTER
// ===================================

async function sendNewsletterEmail(email) {
    if (!initEmailJS()) {
        console.log('EmailJS not configured. Email not sent.');
        return false;
    }

    try {
        const templateParams = {
            to_email: email
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATES.NEWSLETTER,
            templateParams
        );

        console.log('Newsletter welcome email sent!', response);
        return true;
    } catch (error) {
        console.error('Error sending newsletter email:', error);
        return false;
    }
}

// Export for use in other files
window.emailConfig = {
    sendBookingConfirmation: sendBookingConfirmationEmail,
    sendReminder: sendReminderEmail,
    sendNewsletter: sendNewsletterEmail
};

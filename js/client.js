// ===================================
// CLIENT SPACE - Authentication & Management
// ===================================

let currentClientEmail = null;
let currentFilter = 'upcoming';

// Check if client is logged in
document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = sessionStorage.getItem('clientEmail');
    if (savedEmail) {
        loginClient(savedEmail);
    }
});

// Login form
const clientLoginForm = document.getElementById('clientLoginForm');
if (clientLoginForm) {
    clientLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('clientEmail').value.trim();

        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Check if client has bookings
        const clientBookings = window.bookingSystem.getClientBookings(email);

        if (clientBookings.length === 0) {
            showNotification('Aucune réservation trouvée pour cette adresse email', 'error');
            return;
        }

        loginClient(email);
    });
}

function loginClient(email) {
    currentClientEmail = email;
    sessionStorage.setItem('clientEmail', email);

    // Hide login, show content
    document.getElementById('clientLogin').style.display = 'none';
    document.getElementById('clientContent').style.display = 'block';

    // Load client data
    loadClientData();
}

// Logout
const logoutBtn = document.getElementById('clientLogout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentClientEmail = null;
        sessionStorage.removeItem('clientEmail');
        document.getElementById('clientLogin').style.display = 'flex';
        document.getElementById('clientContent').style.display = 'none';
        showNotification('Déconnexion réussie');
    });
}

// Load client data
function loadClientData() {
    const bookings = window.bookingSystem.getClientBookings(currentClientEmail);

    if (bookings.length === 0) {
        return;
    }

    // Get first booking to display name
    const firstBooking = bookings[0];
    document.getElementById('clientName').textContent = `Bienvenue, ${firstBooking.prenom} ${firstBooking.nom}`;
    document.getElementById('clientEmail').textContent = currentClientEmail;

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingCount = bookings.filter(b =>
        b.status === 'confirmed' && new Date(b.date) >= today
    ).length;

    const pastCount = bookings.filter(b =>
        b.status === 'confirmed' && new Date(b.date) < today
    ).length;

    const cancelledCount = bookings.filter(b =>
        b.status === 'cancelled'
    ).length;

    document.getElementById('statUpcoming').textContent = upcomingCount;
    document.getElementById('statPast').textContent = pastCount;
    document.getElementById('statCancelled').textContent = cancelledCount;

    // Load bookings
    loadBookings(currentFilter);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.currentTarget.dataset.filter;
            currentFilter = filter;
            loadBookings(filter);

            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
}

function loadBookings(filter) {
    const bookings = window.bookingSystem.getClientBookings(currentClientEmail);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredBookings = bookings;

    // Apply filter
    switch (filter) {
        case 'upcoming':
            filteredBookings = bookings.filter(b =>
                b.status === 'confirmed' && new Date(b.date) >= today
            );
            break;
        case 'past':
            filteredBookings = bookings.filter(b =>
                b.status === 'confirmed' && new Date(b.date) < today
            );
            break;
        case 'cancelled':
            filteredBookings = bookings.filter(b =>
                b.status === 'cancelled'
            );
            break;
    }

    // Sort by date
    filteredBookings.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });

    displayBookings(filteredBookings);
}

function displayBookings(bookings) {
    const container = document.getElementById('bookingsContainer');

    if (bookings.length === 0) {
        container.innerHTML = '<p class="empty-message">Aucune réservation trouvée</p>';
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    container.innerHTML = bookings.map(booking => {
        const isPast = new Date(booking.date) < today;
        const statusClass = booking.status === 'cancelled' ? 'cancelled' : (isPast ? 'past' : 'confirmed');
        const statusText = booking.status === 'cancelled' ? 'Annulée' : (isPast ? 'Passée' : 'Confirmée');
        const cardClass = booking.status === 'cancelled' ? 'cancelled' : (isPast ? 'past' : '');

        return `
            <div class="booking-card ${cardClass}">
                <div class="booking-card-header">
                    <div class="booking-service">
                        <i class="fas fa-spa"></i>
                        ${window.bookingSystem.getServiceName(booking.service)}
                    </div>
                    <span class="booking-status ${statusClass}">${statusText}</span>
                </div>
                <div class="booking-card-body">
                    <div class="booking-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(booking.date)}</span>
                    </div>
                    <div class="booking-info-item">
                        <i class="fas fa-clock"></i>
                        <span>${booking.time}</span>
                    </div>
                    <div class="booking-info-item">
                        <i class="fas fa-id-badge"></i>
                        <span><code>${booking.id}</code></span>
                    </div>
                    ${booking.message ? `
                    <div class="booking-info-item" style="grid-column: 1/-1;">
                        <i class="fas fa-comment"></i>
                        <span>${booking.message}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="booking-card-footer">
                    ${booking.status === 'confirmed' ? `
                        <button class="btn btn-primary" onclick="downloadClientBookingICS('${booking.id}')">
                            <i class="fas fa-download"></i> Télécharger .ics
                        </button>
                        ${!isPast ? `
                            <button class="btn btn-outline" onclick="cancelClientBooking('${booking.id}')">
                                <i class="fas fa-times"></i> Annuler
                            </button>
                        ` : ''}
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Download ICS for client
window.downloadClientBookingICS = function(bookingId) {
    const bookings = window.bookingSystem.getBookings();
    const booking = bookings.find(b => b.id === bookingId);

    if (booking) {
        window.bookingSystem.downloadICS(booking);
        showNotification('Fichier .ics téléchargé avec succès !');
    }
};

// Cancel booking
window.cancelClientBooking = function(bookingId) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
        window.bookingSystem.cancelBooking(bookingId);
        loadClientData();
        showNotification('Réservation annulée avec succès');
    }
};

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Show notification (reuse from main script)
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

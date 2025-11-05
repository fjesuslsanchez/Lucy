// ===================================
// ADMIN PANEL - Configuration
// ===================================

const ADMIN_PASSWORD = 'admin123'; // À CHANGER EN PRODUCTION !
const AUTH_KEY = 'harmonie-admin-auth';

// ===================================
// AUTHENTICATION
// ===================================

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
    const isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true';

    if (isAuthenticated) {
        showAdminPanel();
    } else {
        showLoginSection();
    }
}

function showLoginSection() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'grid';
    initAdminPanel();
}

// Gestion du formulaire de connexion
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            showAdminPanel();
            showNotification('Connexion réussie !');
        } else {
            showNotification('Mot de passe incorrect', 'error');
        }
    });
}

// Déconnexion
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem(AUTH_KEY);
        showLoginSection();
        showNotification('Déconnexion réussie');
    });
}

// ===================================
// NAVIGATION
// ===================================

function initAdminPanel() {
    // Navigation entre sections
    document.querySelectorAll('.admin-nav-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.dataset.section;
            switchSection(section);
        });
    });

    // Charger le dashboard par défaut
    loadDashboard();
    loadSlots();
    loadBookings();
}

function switchSection(sectionName) {
    // Mettre à jour la navigation
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Mettre à jour les sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}Section`).classList.add('active');

    // Mettre à jour le titre
    const titles = {
        'dashboard': 'Tableau de bord',
        'slots': 'Gestion des créneaux',
        'bookings': 'Réservations',
        'settings': 'Paramètres'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName];

    // Recharger les données si nécessaire
    if (sectionName === 'dashboard') {
        loadDashboard();
    } else if (sectionName === 'slots') {
        loadSlots();
    } else if (sectionName === 'bookings') {
        loadBookings();
    }
}

// ===================================
// DASHBOARD
// ===================================

function loadDashboard() {
    const stats = window.bookingSystem.getStats();
    const enabledSlots = window.bookingSystem.getEnabledSlots();

    // Mettre à jour les statistiques
    document.getElementById('statFuture').textContent = stats.future;
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statSlots').textContent = enabledSlots.length;
    document.getElementById('statCancelled').textContent = stats.cancelled;

    // Afficher les prochaines réservations
    displayUpcomingBookings();
}

function displayUpcomingBookings() {
    const bookings = window.bookingSystem.getBookings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingBookings = bookings
        .filter(b => b.status === 'confirmed' && new Date(b.date) >= today)
        .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
        .slice(0, 5);

    const container = document.getElementById('upcomingBookings');

    if (upcomingBookings.length === 0) {
        container.innerHTML = '<p class="empty-state">Aucune réservation à venir</p>';
        return;
    }

    container.innerHTML = upcomingBookings.map(booking => `
        <div class="booking-item">
            <div class="booking-item-header">
                <strong>${booking.prenom} ${booking.nom}</strong>
                <span class="booking-item-date">${formatDate(booking.date)} à ${booking.time}</span>
            </div>
            <div class="booking-item-info">
                <i class="fas fa-spa"></i> ${window.bookingSystem.getServiceName(booking.service)}
            </div>
        </div>
    `).join('');
}

// ===================================
// SLOTS MANAGEMENT
// ===================================

function loadSlots() {
    const slots = window.bookingSystem.getSlots();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    days.forEach(day => {
        const daySlots = slots.filter(slot => slot.day === day);
        const container = document.getElementById(`slots-${day}`);

        container.innerHTML = daySlots.map(slot => `
            <div class="slot-item ${slot.enabled ? 'enabled' : 'disabled'}" data-slot-id="${slot.id}">
                <div class="slot-time">${slot.time}</div>
                <div class="slot-status">${slot.enabled ? 'Activé' : 'Désactivé'}</div>
            </div>
        `).join('');

        // Ajouter les événements de clic
        container.querySelectorAll('.slot-item').forEach(slotEl => {
            slotEl.addEventListener('click', () => {
                const slotId = slotEl.dataset.slotId;
                toggleSlot(slotId);
            });
        });
    });

    // Boutons pour activer/désactiver tous les créneaux d'un jour
    document.querySelectorAll('.btn-toggle-day').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const day = e.currentTarget.dataset.day;
            const action = e.currentTarget.dataset.action;
            const enabled = action === 'enable';

            window.bookingSystem.toggleDaySlots(day, enabled);
            loadSlots();
            showNotification(`Créneaux du ${window.bookingSystem.getDayNameFr(day)} ${enabled ? 'activés' : 'désactivés'}`);
        });
    });
}

function toggleSlot(slotId) {
    const slot = window.bookingSystem.toggleSlot(slotId);
    loadSlots();
    showNotification(`Créneau ${slot.enabled ? 'activé' : 'désactivé'} : ${window.bookingSystem.getDayNameFr(slot.day)} ${slot.time}`);
}

// Activer tous les créneaux
document.getElementById('enableAllSlots')?.addEventListener('click', () => {
    const slots = window.bookingSystem.getSlots();
    slots.forEach(slot => slot.enabled = true);
    window.bookingSystem.saveSlots(slots);
    loadSlots();
    showNotification('Tous les créneaux ont été activés');
});

// Désactiver tous les créneaux
document.getElementById('disableAllSlots')?.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir désactiver tous les créneaux ?')) {
        const slots = window.bookingSystem.getSlots();
        slots.forEach(slot => slot.enabled = false);
        window.bookingSystem.saveSlots(slots);
        loadSlots();
        showNotification('Tous les créneaux ont été désactivés');
    }
});

// ===================================
// BOOKINGS MANAGEMENT
// ===================================

let currentFilter = 'all';

function loadBookings(filter = 'all') {
    currentFilter = filter;
    const bookings = window.bookingSystem.getBookings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredBookings = bookings;

    // Appliquer le filtre
    switch (filter) {
        case 'future':
            filteredBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= today);
            break;
        case 'past':
            filteredBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) < today);
            break;
        case 'cancelled':
            filteredBookings = bookings.filter(b => b.status === 'cancelled');
            break;
    }

    // Trier par date décroissante
    filteredBookings.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB - dateA;
    });

    const tbody = document.getElementById('bookingsTableBody');

    if (filteredBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">Aucune réservation</td></tr>';
        return;
    }

    tbody.innerHTML = filteredBookings.map(booking => {
        const isPast = new Date(booking.date) < today;
        const statusClass = booking.status === 'cancelled' ? 'cancelled' : (isPast ? 'past' : 'confirmed');
        const statusText = booking.status === 'cancelled' ? 'Annulée' : (isPast ? 'Passée' : 'Confirmée');

        return `
            <tr>
                <td><code>${booking.id}</code></td>
                <td><strong>${booking.prenom} ${booking.nom}</strong></td>
                <td>${window.bookingSystem.getServiceName(booking.service)}</td>
                <td>${formatDate(booking.date)}</td>
                <td>${booking.time}</td>
                <td>${booking.telephone}</td>
                <td>${booking.email}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
                <td class="booking-actions">
                    ${booking.status === 'confirmed' ? `
                        <button class="btn-action download" onclick="downloadBookingICS('${booking.id}')" title="Télécharger .ics">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-action cancel" onclick="cancelBooking('${booking.id}')" title="Annuler">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');

    // Mettre à jour les boutons de filtre
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
}

// Filtres de réservations
document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        loadBookings(filter);
    });
});

// Annuler une réservation
window.cancelBooking = function(bookingId) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
        window.bookingSystem.cancelBooking(bookingId);
        loadBookings(currentFilter);
        loadDashboard();
        showNotification('Réservation annulée avec succès');
    }
};

// Télécharger le fichier .ics
window.downloadBookingICS = function(bookingId) {
    const bookings = window.bookingSystem.getBookings();
    const booking = bookings.find(b => b.id === bookingId);

    if (booking) {
        window.bookingSystem.downloadICS(booking);
        showNotification('Fichier .ics téléchargé');
    }
};

// ===================================
// SETTINGS
// ===================================

// Exporter les données
document.getElementById('exportDataBtn')?.addEventListener('click', () => {
    const data = {
        slots: window.bookingSystem.getSlots(),
        bookings: window.bookingSystem.getBookings(),
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `harmonie-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showNotification('Données exportées avec succès');
});

// Réinitialiser le système
document.getElementById('resetSystemBtn')?.addEventListener('click', () => {
    const confirmation = prompt('Attention ! Cette action va supprimer toutes les données.\nTapez "RESET" pour confirmer :');

    if (confirmation === 'RESET') {
        window.bookingSystem.reset();
        loadDashboard();
        loadSlots();
        loadBookings();
        showNotification('Système réinitialisé avec succès');
    }
});

// ===================================
// NOTIFICATION SYSTEM
// ===================================

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

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

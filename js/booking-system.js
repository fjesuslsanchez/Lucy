// ===================================
// BOOKING SYSTEM - Gestion des créneaux
// ===================================

class BookingSystem {
    constructor() {
        this.storageKey = 'harmonie-booking-slots';
        this.bookingsKey = 'harmonie-bookings';
        this.initDefaultSlots();
    }

    // Initialiser les créneaux par défaut
    initDefaultSlots() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultSlots = this.generateDefaultSlots();
            this.saveSlots(defaultSlots);
        }
    }

    // Générer les créneaux par défaut (tous activés)
    generateDefaultSlots() {
        const slots = [];
        const hours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        days.forEach(day => {
            hours.forEach(hour => {
                // Samedi commence à 10h et finit à 17h
                if (day === 'saturday' && (hour === '09:00' || hour === '18:00')) {
                    return;
                }

                slots.push({
                    id: `${day}-${hour}`,
                    day: day,
                    time: hour,
                    enabled: true,
                    duration: 60 // minutes
                });
            });
        });

        return slots;
    }

    // Sauvegarder les créneaux
    saveSlots(slots) {
        localStorage.setItem(this.storageKey, JSON.stringify(slots));
    }

    // Récupérer tous les créneaux
    getSlots() {
        const slots = localStorage.getItem(this.storageKey);
        return slots ? JSON.parse(slots) : [];
    }

    // Récupérer les créneaux activés
    getEnabledSlots() {
        return this.getSlots().filter(slot => slot.enabled);
    }

    // Activer/Désactiver un créneau
    toggleSlot(slotId) {
        const slots = this.getSlots();
        const slot = slots.find(s => s.id === slotId);
        if (slot) {
            slot.enabled = !slot.enabled;
            this.saveSlots(slots);
        }
        return slot;
    }

    // Activer/Désactiver tous les créneaux d'un jour
    toggleDaySlots(day, enabled) {
        const slots = this.getSlots();
        slots.forEach(slot => {
            if (slot.day === day) {
                slot.enabled = enabled;
            }
        });
        this.saveSlots(slots);
    }

    // Récupérer les créneaux disponibles pour une date
    getAvailableSlotsForDate(date) {
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();

        // Dimanche = 0, on refuse
        if (dayOfWeek === 0) {
            return [];
        }

        // Convertir le jour de la semaine en nom
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayOfWeek];

        // Récupérer les créneaux activés pour ce jour
        const enabledSlots = this.getEnabledSlots().filter(slot => slot.day === dayName);

        // Vérifier quels créneaux sont déjà réservés
        const bookings = this.getBookings();
        const bookedSlotsForDate = bookings
            .filter(b => b.date === date && b.status === 'confirmed')
            .map(b => b.time);

        // Filtrer les créneaux disponibles
        return enabledSlots
            .filter(slot => !bookedSlotsForDate.includes(slot.time))
            .map(slot => ({
                time: slot.time,
                duration: slot.duration,
                available: true
            }));
    }

    // Sauvegarder une réservation
    saveBooking(bookingData) {
        const bookings = this.getBookings();
        const booking = {
            id: this.generateBookingId(),
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        bookings.push(booking);
        localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
        return booking;
    }

    // Récupérer toutes les réservations
    getBookings() {
        const bookings = localStorage.getItem(this.bookingsKey);
        return bookings ? JSON.parse(bookings) : [];
    }

    // Récupérer les réservations d'un client
    getClientBookings(email) {
        return this.getBookings().filter(b => b.email === email);
    }

    // Annuler une réservation
    cancelBooking(bookingId) {
        const bookings = this.getBookings();
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'cancelled';
            booking.cancelledAt = new Date().toISOString();
            localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
        }
        return booking;
    }

    // Générer un ID de réservation unique
    generateBookingId() {
        return 'BKG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Vérifier si un créneau est disponible
    isSlotAvailable(date, time) {
        const availableSlots = this.getAvailableSlotsForDate(date);
        return availableSlots.some(slot => slot.time === time);
    }

    // Récupérer les statistiques pour l'admin
    getStats() {
        const bookings = this.getBookings();
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
        const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

        // Réservations futures
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const futureBookings = confirmedBookings.filter(b => new Date(b.date) >= today);

        // Réservations passées
        const pastBookings = confirmedBookings.filter(b => new Date(b.date) < today);

        return {
            total: bookings.length,
            confirmed: confirmedBookings.length,
            cancelled: cancelledBookings.length,
            future: futureBookings.length,
            past: pastBookings.length
        };
    }

    // Exporter les créneaux disponibles pour un mois
    getMonthSlots(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthSlots = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();

            // Skip Sundays
            if (dayOfWeek === 0) continue;

            const availableSlots = this.getAvailableSlotsForDate(dateString);

            if (availableSlots.length > 0) {
                monthSlots.push({
                    date: dateString,
                    dayOfWeek: dayOfWeek,
                    slots: availableSlots
                });
            }
        }

        return monthSlots;
    }

    // Générer un fichier .ics pour une réservation (Apple Calendar)
    generateICS(booking) {
        const startDate = new Date(booking.date + 'T' + booking.time);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 heure

        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Harmonie & Bien-Être//Booking//FR',
            'CALSCALE:GREGORIAN',
            'METHOD:REQUEST',
            'BEGIN:VEVENT',
            `UID:${booking.id}@harmonie-bienetre.fr`,
            `DTSTAMP:${formatDate(new Date())}`,
            `DTSTART:${formatDate(startDate)}`,
            `DTEND:${formatDate(endDate)}`,
            `SUMMARY:${this.getServiceName(booking.service)} - Harmonie & Bien-Être`,
            `DESCRIPTION:Réservation confirmée\\n\\nService: ${this.getServiceName(booking.service)}\\nClient: ${booking.prenom} ${booking.nom}\\nTéléphone: ${booking.telephone}\\n\\nAdresse: 123 Rue de la Paix, 75001 Paris`,
            'LOCATION:123 Rue de la Paix\\, 75001 Paris\\, France',
            'STATUS:CONFIRMED',
            'SEQUENCE:0',
            'BEGIN:VALARM',
            'TRIGGER:-PT1H',
            'ACTION:DISPLAY',
            'DESCRIPTION:Rappel: Rendez-vous dans 1 heure',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        return icsContent;
    }

    // Télécharger le fichier .ics
    downloadICS(booking) {
        const icsContent = this.generateICS(booking);
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reservation-${booking.id}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Obtenir le nom du service
    getServiceName(serviceValue) {
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

    // Obtenir le jour en français
    getDayNameFr(dayName) {
        const days = {
            'monday': 'Lundi',
            'tuesday': 'Mardi',
            'wednesday': 'Mercredi',
            'thursday': 'Jeudi',
            'friday': 'Vendredi',
            'saturday': 'Samedi',
            'sunday': 'Dimanche'
        };
        return days[dayName] || dayName;
    }

    // Réinitialiser le système (pour tests)
    reset() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.bookingsKey);
        this.initDefaultSlots();
    }
}

// Export de l'instance globale
window.bookingSystem = new BookingSystem();

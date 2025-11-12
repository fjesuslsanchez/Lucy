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

    // Changer la durée d'un créneau (admin)
    setSlotDuration(slotId, duration) {
        const slots = this.getSlots();
        const slot = slots.find(s => s.id === slotId);
        if (slot) {
            slot.duration = duration; // 30, 60, 90, 120 minutes
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
            .map(b => ({ time: b.time, duration: b.duration || 60 }));

        // Générer des sous-créneaux de 30 minutes
        const availableSubSlots = [];

        enabledSlots.forEach(slot => {
            // Générer des sous-créneaux de 30 minutes pour ce créneau principal
            const numSubSlots = slot.duration / 30; // Ex: 60min = 2 sous-créneaux, 90min = 3

            for (let i = 0; i < numSubSlots; i++) {
                const [hours, minutes] = slot.time.split(':').map(Number);
                const subSlotMinutes = minutes + (i * 30);
                const subSlotHours = hours + Math.floor(subSlotMinutes / 60);
                const finalMinutes = subSlotMinutes % 60;

                const subSlotTime = `${String(subSlotHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;

                // Vérifier si ce sous-créneau est disponible
                const isBooked = bookedSlotsForDate.some(booking => {
                    // Convertir les heures en minutes pour comparer
                    const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
                    const bookingStart = bookingHours * 60 + bookingMinutes;
                    const bookingEnd = bookingStart + (booking.duration || 60);

                    const subSlotStart = subSlotHours * 60 + finalMinutes;

                    // Vérifier s'il y a chevauchement
                    return subSlotStart >= bookingStart && subSlotStart < bookingEnd;
                });

                if (!isBooked) {
                    availableSubSlots.push({
                        time: subSlotTime,
                        duration: 30,
                        parentSlot: slot.time,
                        parentDuration: slot.duration,
                        available: true
                    });
                }
            }
        });

        return availableSubSlots;
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

    // Récupérer les créneaux disponibles pour une date ET une durée spécifique
    getAvailableSlotsForDateAndDuration(date, requestedDuration) {
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
            .map(b => ({ time: b.time, duration: b.duration || 60 }));

        // Générer les créneaux disponibles pour la durée demandée
        const availableSlots = [];

        enabledSlots.forEach(slot => {
            const [slotHours, slotMinutes] = slot.time.split(':').map(Number);
            const slotStartInMinutes = slotHours * 60 + slotMinutes;

            // Vérifier si on peut créer un créneau de la durée demandée à partir de ce slot
            // On vérifie pour chaque sous-créneau de 30 minutes
            const numSubSlots = slot.duration / 30;

            for (let i = 0; i < numSubSlots; i++) {
                const subSlotStartInMinutes = slotStartInMinutes + (i * 30);
                const subSlotHours = Math.floor(subSlotStartInMinutes / 60);
                const subSlotMinutes = subSlotStartInMinutes % 60;
                const subSlotTime = `${String(subSlotHours).padStart(2, '0')}:${String(subSlotMinutes).padStart(2, '0')}`;

                // Vérifier si on peut réserver la durée demandée à partir de ce sous-créneau
                let canBook = true;

                // Vérifier que le créneau ne dépasse pas la fin du slot parent
                const requestedEndInMinutes = subSlotStartInMinutes + requestedDuration;
                const slotEndInMinutes = slotStartInMinutes + slot.duration;

                if (requestedEndInMinutes > slotEndInMinutes) {
                    canBook = false;
                }

                // Vérifier qu'il n'y a pas de chevauchement avec des réservations existantes
                if (canBook) {
                    for (const booking of bookedSlotsForDate) {
                        const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
                        const bookingStart = bookingHours * 60 + bookingMinutes;
                        const bookingEnd = bookingStart + (booking.duration || 60);

                        const requestedStart = subSlotStartInMinutes;
                        const requestedEnd = requestedStart + requestedDuration;

                        // Vérifier s'il y a chevauchement
                        if ((requestedStart < bookingEnd) && (requestedEnd > bookingStart)) {
                            canBook = false;
                            break;
                        }
                    }
                }

                if (canBook) {
                    availableSlots.push({
                        time: subSlotTime,
                        duration: requestedDuration,
                        parentSlot: slot.time,
                        parentDuration: slot.duration,
                        available: true
                    });
                }
            }
        });

        // Supprimer les doublons (même heure)
        const uniqueSlots = [];
        const seenTimes = new Set();

        for (const slot of availableSlots) {
            if (!seenTimes.has(slot.time)) {
                seenTimes.add(slot.time);
                uniqueSlots.push(slot);
            }
        }

        return uniqueSlots;
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
        const duration = booking.duration || 60; // Durée en minutes (par défaut 60)
        const endDate = new Date(startDate.getTime() + duration * 60 * 1000); // Durée variable

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

    // Obtenir la durée du service (en minutes)
    getServiceDuration(serviceValue) {
        const durations = {
            'massage-suedois': 60,
            'massage-californien': 60,
            'massage-sportif': 60,
            'pierres-chaudes': 90,
            'reflexologie': 30,
            'olfactotherapie': 60
        };
        return durations[serviceValue] || 60; // Par défaut 60 minutes
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

// ===================================
// LOYALTY SYSTEM - Programme de fidélité
// ===================================

class LoyaltySystem {
    constructor() {
        this.storageKey = 'harmonie-loyalty';
    }

    // Get customer loyalty data
    getCustomerData(email) {
        const allData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        if (!allData[email]) {
            allData[email] = {
                email: email,
                points: 0,
                level: 'bronze',
                totalBookings: 0,
                totalSpent: 0,
                rewards: []
            };
        }
        return allData[email];
    }

    // Save customer data
    saveCustomerData(email, data) {
        const allData = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        allData[email] = data;
        localStorage.setItem(this.storageKey, JSON.stringify(allData));
    }

    // Add points for a booking
    addPointsForBooking(email, service) {
        const data = this.getCustomerData(email);
        const prices = {
            'massage-suedois': 75,
            'massage-californien': 75,
            'massage-sportif': 75,
            'reflexologie': 45,
            'pierres-chaudes': 110,
            'olfactotherapie': 75
        };
        
        const price = prices[service] || 75;
        const points = Math.floor(price / 10); // 1 point per 10€
        
        data.points += points;
        data.totalBookings += 1;
        data.totalSpent += price;
        
        // Update level
        this.updateLevel(data);
        
        this.saveCustomerData(email, data);
        return points;
    }

    // Update level based on points
    updateLevel(data) {
        if (data.points >= 200) {
            data.level = 'platinum';
        } else if (data.points >= 100) {
            data.level = 'gold';
        } else if (data.points >= 50) {
            data.level = 'silver';
        } else {
            data.level = 'bronze';
        }
    }

    // Get available rewards
    getAvailableRewards(email) {
        const data = this.getCustomerData(email);
        const rewards = [
            { id: 1, name: 'Réduction 10%', points: 50, discount: 0.10 },
            { id: 2, name: 'Réduction 15%', points: 100, discount: 0.15 },
            { id: 3, name: 'Massage gratuit 30min', points: 150, discount: 45 },
            { id: 4, name: 'Réduction 25%', points: 200, discount: 0.25 }
        ];
        
        return rewards.filter(r => data.points >= r.points);
    }

    // Get level benefits
    getLevelBenefits(level) {
        const benefits = {
            'bronze': { discount: 0, priority: false, name: 'Bronze' },
            'silver': { discount: 0.05, priority: false, name: 'Argent' },
            'gold': { discount: 0.10, priority: true, name: 'Or' },
            'platinum': { discount: 0.15, priority: true, name: 'Platine' }
        };
        return benefits[level] || benefits.bronze;
    }
}

// Export instance
window.loyaltySystem = new LoyaltySystem();

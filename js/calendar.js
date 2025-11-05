// ===================================
// INTERACTIVE BOOKING CALENDAR
// ===================================

class BookingCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const monthSlots = window.bookingSystem.getMonthSlots(year, month);

        this.container.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-nav-btn" id="prevMonth">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <h3 class="calendar-title">${this.getMonthName(month)} ${year}</h3>
                    <button class="calendar-nav-btn" id="nextMonth">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="calendar-grid">
                    ${this.renderCalendar(year, month, monthSlots)}
                </div>
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-color available"></span>
                        <span>Disponible</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color selected"></span>
                        <span>Sélectionné</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color unavailable"></span>
                        <span>Indisponible</span>
                    </div>
                </div>
            </div>
            <div class="time-slots-container" id="timeSlotsContainer" style="display: none;">
                <h4>Créneaux disponibles pour le <span id="selectedDateDisplay"></span></h4>
                <div class="time-slots-grid" id="timeSlotsGrid"></div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderCalendar(year, month, monthSlots) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Adjust firstDay (0 = Sunday, 1 = Monday, etc.)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        let html = '<div class="calendar-weekdays">';
        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        weekdays.forEach(day => {
            html += `<div class="calendar-weekday">${day}</div>`;
        });
        html += '</div>';

        html += '<div class="calendar-days">';

        // Empty cells before first day
        for (let i = 0; i < adjustedFirstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();

            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const isSunday = dayOfWeek === 0;
            const hasSlots = monthSlots.some(slot => slot.date === dateString);
            const isSelected = this.selectedDate === dateString;

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isPast || isSunday) classes += ' disabled';
            if (hasSlots && !isPast && !isSunday) classes += ' available';
            if (isSelected) classes += ' selected';

            let title = '';
            if (isSunday) title = 'Fermé le dimanche';
            else if (isPast) title = 'Date passée';
            else if (hasSlots) {
                const daySlots = monthSlots.find(slot => slot.date === dateString);
                title = `${daySlots.slots.length} créneau(x) disponible(s)`;
            } else {
                title = 'Aucun créneau disponible';
            }

            html += `
                <div class="${classes}"
                     data-date="${dateString}"
                     data-has-slots="${hasSlots}"
                     title="${title}">
                    <span class="day-number">${day}</span>
                    ${hasSlots && !isPast && !isSunday ? '<span class="day-indicator"></span>' : ''}
                </div>
            `;
        }

        html += '</div>';

        return html;
    }

    attachEventListeners() {
        // Navigation buttons
        document.getElementById('prevMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('nextMonth')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        // Day selection
        document.querySelectorAll('.calendar-day.available').forEach(day => {
            day.addEventListener('click', (e) => {
                const date = e.currentTarget.dataset.date;
                this.selectDate(date);
            });
        });
    }

    selectDate(dateString) {
        this.selectedDate = dateString;
        this.selectedTime = null;

        // Update visual selection
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        document.querySelector(`.calendar-day[data-date="${dateString}"]`)?.classList.add('selected');

        // Load time slots
        this.loadTimeSlots(dateString);

        // Update hidden date input
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = dateString;
        }
    }

    loadTimeSlots(dateString) {
        const availableSlots = window.bookingSystem.getAvailableSlotsForDate(dateString);
        const container = document.getElementById('timeSlotsContainer');
        const grid = document.getElementById('timeSlotsGrid');
        const dateDisplay = document.getElementById('selectedDateDisplay');

        if (availableSlots.length === 0) {
            container.style.display = 'none';
            return;
        }

        // Format date for display
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateDisplay.textContent = formattedDate;

        // Render time slots
        grid.innerHTML = availableSlots.map(slot => `
            <div class="time-slot-item" data-time="${slot.time}">
                <i class="fas fa-clock"></i>
                <span class="time-slot-time">${slot.time}</span>
                <span class="time-slot-duration">${slot.duration} min</span>
            </div>
        `).join('');

        container.style.display = 'block';

        // Attach time slot selection
        document.querySelectorAll('.time-slot-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const time = e.currentTarget.dataset.time;
                this.selectTime(time);
            });
        });

        // Scroll to time slots
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    selectTime(time) {
        this.selectedTime = time;

        // Update visual selection
        document.querySelectorAll('.time-slot-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.time-slot-item[data-time="${time}"]`)?.classList.add('selected');

        // Update hidden time input
        const timeInput = document.getElementById('heure');
        if (timeInput) {
            timeInput.value = time;

            // If it's a select, create the option if it doesn't exist
            if (timeInput.tagName === 'SELECT') {
                let option = Array.from(timeInput.options).find(opt => opt.value === time);
                if (!option) {
                    option = new Option(time, time);
                    timeInput.add(option);
                }
                timeInput.value = time;
            }
        }
    }

    getMonthName(month) {
        const months = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        return months[month];
    }

    getSelectedDateTime() {
        return {
            date: this.selectedDate,
            time: this.selectedTime
        };
    }

    reset() {
        this.selectedDate = null;
        this.selectedTime = null;
        this.render();
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bookingCalendar')) {
        window.bookingCalendar = new BookingCalendar('bookingCalendar');
    }
});

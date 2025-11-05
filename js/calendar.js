// ===================================
// VISUAL BOOKING CALENDAR - Enhanced
// ===================================

class BookingCalendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTime = null;
        this.viewMode = 'month'; // 'month' or 'week'
        this.init();
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-controls">
                    <div class="calendar-header">
                        <button class="calendar-nav-btn" id="prevPeriod">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3 class="calendar-title" id="calendarTitle">${this.getTitle()}</h3>
                        <button class="calendar-nav-btn" id="nextPeriod">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="view-toggle">
                        <button class="view-btn ${this.viewMode === 'month' ? 'active' : ''}" data-view="month">
                            <i class="fas fa-calendar"></i> Mois
                        </button>
                        <button class="view-btn ${this.viewMode === 'week' ? 'active' : ''}" data-view="week">
                            <i class="fas fa-calendar-week"></i> Semaine
                        </button>
                    </div>
                </div>
                <div class="calendar-view">
                    ${this.viewMode === 'month' ? this.renderMonthView() : this.renderWeekView()}
                </div>
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-dot available"></span>
                        <span>Créneaux disponibles</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot selected"></span>
                        <span>Sélectionné</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot unavailable"></span>
                        <span>Complet</span>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    getTitle() {
        if (this.viewMode === 'month') {
            return `${this.getMonthName(this.currentDate.getMonth())} ${this.currentDate.getFullYear()}`;
        } else {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            return `Semaine du ${weekStart.getDate()} ${this.getMonthName(weekStart.getMonth())} au ${weekEnd.getDate()} ${this.getMonthName(weekEnd.getMonth())} ${weekEnd.getFullYear()}`;
        }
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        let html = '<div class="month-view">';

        // Weekdays header
        html += '<div class="month-weekdays">';
        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        weekdays.forEach(day => {
            html += `<div class="month-weekday">${day}</div>`;
        });
        html += '</div>';

        // Days grid
        html += '<div class="month-days-grid">';

        // Empty cells
        for (let i = 0; i < adjustedFirstDay; i++) {
            html += '<div class="month-day empty"></div>';
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();

            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const isSunday = dayOfWeek === 0;
            const isSelected = this.selectedDate === dateString;

            const availableSlots = !isPast && !isSunday ?
                window.bookingSystem.getAvailableSlotsForDate(dateString) : [];

            const slotsCount = availableSlots.length;

            let classes = 'month-day';
            if (isToday) classes += ' today';
            if (isPast || isSunday) classes += ' disabled';
            if (isSelected) classes += ' selected';
            if (slotsCount > 0 && !isPast && !isSunday) classes += ' has-slots';

            html += `
                <div class="${classes}" data-date="${dateString}" data-has-slots="${slotsCount > 0}">
                    <div class="day-number">${day}</div>
                    ${slotsCount > 0 ? `
                        <div class="slots-preview">
                            ${availableSlots.slice(0, 3).map(slot =>
                                `<div class="slot-chip" data-time="${slot.time}">${slot.time}</div>`
                            ).join('')}
                            ${slotsCount > 3 ? `<div class="slot-chip more">+${slotsCount - 3}</div>` : ''}
                        </div>
                    ` : (isPast || isSunday ? '<div class="no-slots">—</div>' : '<div class="no-slots">Complet</div>')}
                </div>
            `;
        }

        html += '</div></div>';

        return html;
    }

    renderWeekView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        const weekDays = [];

        // Get 7 days of the week
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            weekDays.push(day);
        }

        let html = '<div class="week-view">';

        // Header with days
        html += '<div class="week-header">';
        html += '<div class="time-column-header">Heure</div>';

        weekDays.forEach(day => {
            const dateString = day.toISOString().split('T')[0];
            const dayOfWeek = day.getDay();
            const isToday = day.getTime() === today.getTime();
            const isPast = day < today;
            const isSunday = dayOfWeek === 0;

            const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][dayOfWeek];
            const dayNum = day.getDate();

            let classes = 'week-day-header';
            if (isToday) classes += ' today';
            if (isSunday) classes += ' sunday';

            html += `
                <div class="${classes}">
                    <div class="day-name">${dayName}</div>
                    <div class="day-date">${dayNum}</div>
                </div>
            `;
        });
        html += '</div>';

        // Time slots grid
        html += '<div class="week-grid">';

        hours.forEach(hour => {
            html += `<div class="time-slot-row">`;
            html += `<div class="time-label">${hour}</div>`;

            weekDays.forEach(day => {
                const dateString = day.toISOString().split('T')[0];
                const dayOfWeek = day.getDay();
                const isPast = day < today;
                const isSunday = dayOfWeek === 0;

                let slotAvailable = false;
                if (!isPast && !isSunday) {
                    const availableSlots = window.bookingSystem.getAvailableSlotsForDate(dateString);
                    slotAvailable = availableSlots.some(slot => slot.time === hour);
                }

                const isSelected = this.selectedDate === dateString && this.selectedTime === hour;

                let classes = 'week-time-slot';
                if (isPast || isSunday) classes += ' disabled';
                if (slotAvailable) classes += ' available';
                if (isSelected) classes += ' selected';

                html += `
                    <div class="${classes}"
                         data-date="${dateString}"
                         data-time="${hour}"
                         data-available="${slotAvailable}">
                        ${slotAvailable ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                `;
            });

            html += `</div>`;
        });

        html += '</div></div>';

        return html;
    }

    attachEventListeners() {
        // Navigation buttons
        document.getElementById('prevPeriod')?.addEventListener('click', () => {
            if (this.viewMode === 'month') {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            } else {
                this.currentDate.setDate(this.currentDate.getDate() - 7);
            }
            this.render();
        });

        document.getElementById('nextPeriod')?.addEventListener('click', () => {
            if (this.viewMode === 'month') {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            } else {
                this.currentDate.setDate(this.currentDate.getDate() + 7);
            }
            this.render();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewMode = e.currentTarget.dataset.view;
                this.render();
            });
        });

        // Month view - day selection
        document.querySelectorAll('.month-day.has-slots').forEach(day => {
            day.addEventListener('click', (e) => {
                if (!e.target.closest('.slot-chip')) {
                    const date = e.currentTarget.dataset.date;
                    this.selectDate(date);
                }
            });
        });

        // Month view - slot chip selection
        document.querySelectorAll('.slot-chip[data-time]').forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                const dayEl = e.target.closest('.month-day');
                const date = dayEl.dataset.date;
                const time = e.currentTarget.dataset.time;
                this.selectDateTime(date, time);
            });
        });

        // Week view - slot selection
        document.querySelectorAll('.week-time-slot.available').forEach(slot => {
            slot.addEventListener('click', (e) => {
                const date = e.currentTarget.dataset.date;
                const time = e.currentTarget.dataset.time;
                this.selectDateTime(date, time);
            });
        });
    }

    selectDate(dateString) {
        this.selectedDate = dateString;
        this.selectedTime = null;

        // Update hidden date input
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = dateString;
            dateInput.dispatchEvent(new Event('change'));
        }

        // Switch to week view to show time slots
        this.viewMode = 'week';
        this.currentDate = new Date(dateString);
        this.render();
    }

    selectDateTime(dateString, time) {
        this.selectedDate = dateString;
        this.selectedTime = time;

        // Update hidden inputs
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('heure');

        if (dateInput) {
            dateInput.value = dateString;
            dateInput.dispatchEvent(new Event('change'));
        }

        if (timeInput) {
            timeInput.value = time;
            timeInput.dispatchEvent(new Event('change'));
        }

        // Show form with animation
        const calendarWrapper = document.getElementById('calendarWrapper');
        const formWrapper = document.getElementById('formWrapper');

        if (calendarWrapper && formWrapper) {
            calendarWrapper.classList.add('reduced');
            formWrapper.classList.add('visible');
        }

        // Update selected slot display
        const selectedSlotDisplay = document.getElementById('selectedSlotDisplay');
        const selectedSlotText = document.getElementById('selectedSlotText');

        if (selectedSlotDisplay && selectedSlotText) {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            selectedSlotText.textContent = `${formattedDate} à ${time}`;
            selectedSlotDisplay.style.display = 'block';
        }

        // Re-render to show selection
        this.render();

        // Scroll to form smoothly
        setTimeout(() => {
            document.getElementById('reservationForm')?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
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
        this.currentDate = new Date();
        this.viewMode = 'month';

        // Reset layout classes
        const calendarWrapper = document.getElementById('calendarWrapper');
        const formWrapper = document.getElementById('formWrapper');

        if (calendarWrapper) {
            calendarWrapper.classList.remove('reduced');
        }
        if (formWrapper) {
            formWrapper.classList.remove('visible');
        }

        // Hide selected slot display
        const selectedSlotDisplay = document.getElementById('selectedSlotDisplay');
        if (selectedSlotDisplay) {
            selectedSlotDisplay.style.display = 'none';
        }

        this.render();
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bookingCalendar')) {
        window.bookingCalendar = new BookingCalendar('bookingCalendar');
    }
});

// ===================================
// MULTILINGUAL SYSTEM - FR/EN
// ===================================

const translations = {
    fr: {
        nav: {
            home: 'Accueil',
            services: 'Services',
            prices: 'Tarifs',
            gallery: 'Galerie',
            testimonials: 'Témoignages',
            about: 'À Propos',
            contact: 'Contact',
            blog: 'Blog',
            clientSpace: 'Espace Client',
            book: 'Réserver'
        },
        home: {
            title: 'Harmonie & Bien-Être',
            subtitle: 'Massages thérapeutiques et olfactothérapie',
            bookButton: 'Réserver un rendez-vous',
            discoverButton: 'Découvrir nos services'
        },
        booking: {
            title: 'Réservation',
            selectDate: 'Sélectionnez une date',
            selectTime: 'Choisissez un créneau',
            monthView: 'Mois',
            weekView: 'Semaine',
            confirm: 'Confirmer la réservation'
        },
        loyalty: {
            yourLevel: 'Votre niveau',
            points: 'points',
            rewards: 'Récompenses disponibles'
        }
    },
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            prices: 'Prices',
            gallery: 'Gallery',
            testimonials: 'Testimonials',
            about: 'About',
            contact: 'Contact',
            blog: 'Blog',
            clientSpace: 'Client Space',
            book: 'Book'
        },
        home: {
            title: 'Harmony & Wellness',
            subtitle: 'Therapeutic massages and aromatherapy',
            bookButton: 'Book an appointment',
            discoverButton: 'Discover our services'
        },
        booking: {
            title: 'Booking',
            selectDate: 'Select a date',
            selectTime: 'Choose a time slot',
            monthView: 'Month',
            weekView: 'Week',
            confirm: 'Confirm booking'
        },
        loyalty: {
            yourLevel: 'Your level',
            points: 'points',
            rewards: 'Available rewards'
        }
    }
};

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.translations = translations;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePage();
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    }

    updatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Create global instance
window.i18n = new I18n();

// Language toggle button
function createLanguageToggle() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.getElementById('languageToggle')) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.id = 'languageToggle';
        btn.className = 'language-toggle';
        btn.innerHTML = '<i class="fas fa-globe"></i> ' + (window.i18n.getCurrentLanguage() === 'fr' ? 'EN' : 'FR');
        btn.onclick = () => {
            const newLang = window.i18n.getCurrentLanguage() === 'fr' ? 'en' : 'fr';
            window.i18n.setLanguage(newLang);
            btn.innerHTML = '<i class="fas fa-globe"></i> ' + (newLang === 'fr' ? 'EN' : 'FR');
        };
        li.appendChild(btn);
        navMenu.insertBefore(li, navMenu.lastElementChild);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    createLanguageToggle();
    window.i18n.updatePage();
});

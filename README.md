# 🌿 Harmonie & Bien-Être - Site Web de Massages & Olfactothérapie

Un site web élégant et moderne pour présenter des services de massages thérapeutiques et d'olfactothérapie.

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales
- **Page d'accueil attractive** avec design apaisant et professionnel
- **Présentation détaillée des services** :
  - Massage Suédois
  - Massage Californien
  - Massage Sportif
  - Massage aux Pierres Chaudes
  - Réflexologie Plantaire
  - Olfactothérapie (avec badge spécial)
- **Système de réservation en ligne** avec formulaire complet
- **Formulaire de contact** avec validation
- **Galerie photos** pour montrer l'ambiance
- **Section témoignages clients** avec évaluations 5 étoiles
- **Section "À propos"** avec présentation professionnelle
- **Grille tarifaire** avec 3 forfaits
- **Design 100% responsive** (mobile, tablette, desktop)

### 🎨 Design & UX
- Palette de couleurs apaisante (vert sauge, crème, or doux)
- Typographies élégantes (Cormorant Garamond + Montserrat)
- Animations fluides au scroll
- Navigation fixe avec effet au défilement
- Icônes Font Awesome
- Système de notifications toast
- Accessibilité clavier

### 📱 Responsive
- Adapté à tous les écrans (mobile, tablette, desktop)
- Menu hamburger sur mobile
- Grilles flexibles qui s'adaptent automatiquement

## 🚀 Installation & Utilisation

### Installation simple
1. Clonez ou téléchargez ce repository
2. Ouvrez `index.html` dans votre navigateur
3. C'est tout ! Le site fonctionne sans serveur

### Structure des fichiers
```
Lucy/
├── index.html              # Page principale
├── admin.html              # Interface d'administration
├── client.html             # Espace client
├── css/
│   ├── styles.css         # Styles principaux
│   ├── calendar.css       # Styles du calendrier
│   ├── admin.css          # Styles administration
│   └── client.css         # Styles espace client
├── js/
│   ├── script.js          # Fonctionnalités principales
│   ├── booking-system.js  # Système de réservation
│   ├── calendar.js        # Calendrier interactif
│   ├── admin.js           # Panel d'administration
│   └── client.js          # Espace client
├── images/                # Dossier pour vos images
└── README.md              # Ce fichier
```

### 🔐 Accès Administration
1. Ouvrez `admin.html` dans votre navigateur
2. Mot de passe par défaut : **admin123**
3. **IMPORTANT** : Changez le mot de passe dans `js/admin.js` (ligne 8) avant la mise en production
4. Depuis l'admin, vous pouvez :
   - Gérer les créneaux disponibles (activer/désactiver)
   - Voir toutes les réservations
   - Consulter les statistiques
   - Exporter les données

### 👤 Espace Client
1. Les clients accèdent à `client.html`
2. Ils entrent leur email utilisé lors de la réservation
3. Ils peuvent alors :
   - Consulter leurs réservations
   - Télécharger les fichiers .ics
   - Annuler leurs réservations
   - Voir leurs statistiques

## 🎨 Personnalisation

### 1. Modifier les informations de contact
Dans `index.html`, recherchez et modifiez :
- **Téléphone** : `+33 6 12 34 56 78`
- **Email** : `contact@harmonie-bienetre.fr`
- **Adresse** : `123 Rue de la Paix, 75001 Paris`

### 2. Ajouter vos photos
1. Placez vos photos dans le dossier `images/`
2. Dans `index.html`, remplacez les `galerie-placeholder` par :
```html
<img src="images/votre-photo.jpg" alt="Description">
```

**Photos recommandées :**
- Photo de profil (pour la section À propos)
- 6 photos d'ambiance (espace de massage, huiles essentielles, etc.)
- Format JPG ou PNG optimisé
- Dimensions recommandées : 800x600px minimum

### 3. Modifier les couleurs
Dans `css/styles.css`, modifiez les variables CSS :
```css
:root {
    --primary-color: #8B9D83;      /* Votre couleur principale */
    --secondary-color: #D4A574;    /* Votre couleur secondaire */
    --accent-color: #C9ADA7;       /* Couleur d'accent */
}
```

### 4. Personnaliser les services
Dans `index.html`, section `#services`, vous pouvez :
- Ajouter/supprimer des services
- Modifier les descriptions
- Changer les icônes (voir [Font Awesome](https://fontawesome.com/icons))

### 5. Modifier les tarifs
Dans `index.html`, section `#tarifs`, ajustez les prix et durées selon vos besoins.

### 6. Changer les horaires
Dans `index.html`, section `#reservation`, modifiez les horaires d'ouverture :
```html
<li><strong>Lundi - Vendredi :</strong> 9h - 19h</li>
<li><strong>Samedi :</strong> 10h - 17h</li>
```

### 7. Personnaliser les réseaux sociaux
Les liens vers vos réseaux sociaux apparaissent dans deux endroits :
- **Section Contact** (ligne ~590)
- **Footer** (ligne ~660)

**Réseaux sociaux intégrés :**
- Facebook
- Instagram
- TikTok
- LinkedIn

**Pour personnaliser :**

Dans `index.html`, recherchez et remplacez les URLs par défaut par vos vrais liens :

```html
<!-- Remplacez ces URLs par vos profils réels -->
<a href="https://www.facebook.com/harmonie.bienetre" ...>         <!-- Votre page Facebook -->
<a href="https://www.instagram.com/harmonie.bienetre" ...>        <!-- Votre compte Instagram -->
<a href="https://www.tiktok.com/@harmonie.bienetre" ...>          <!-- Votre compte TikTok -->
<a href="https://www.linkedin.com/company/harmonie-bienetre" ...> <!-- Votre page LinkedIn -->
```

**Ajouter d'autres réseaux sociaux :**

Pour ajouter YouTube, Pinterest, ou autres :

```html
<a href="https://www.youtube.com/@votre-chaine" target="_blank" rel="noopener noreferrer" class="social-link" title="YouTube">
    <i class="fab fa-youtube"></i>
</a>
```

Voir la liste complète des icônes sur [Font Awesome](https://fontawesome.com/icons?d=gallery&s=brands).

## 📧 Configuration des emails

### Option 1 : EmailJS (Recommandé - Gratuit)
1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Créez un template d'email
3. Ajoutez leur SDK dans `index.html` avant la fermeture de `</body>` :
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init("VOTRE_PUBLIC_KEY");
</script>
```
4. Décommentez et configurez les fonctions dans `js/script.js` :
   - `sendReservationEmail()`
   - `sendContactEmail()`

### Option 2 : Backend personnalisé
Si vous avez un serveur backend, modifiez les fonctions de soumission dans `js/script.js` pour envoyer les données à votre API.

### Option 3 : Formspree (Alternative gratuite)
Utilisez [Formspree](https://formspree.io/) pour recevoir les soumissions par email sans backend.

## 🔧 Fonctionnalités avancées

### Ajouter Google Analytics
Dans `index.html`, ajoutez avant `</head>` :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Ajouter une Google Map
Dans la section contact, remplacez le lien par une vraie carte :
```html
<iframe
    src="https://www.google.com/maps/embed?pb=YOUR_MAP_EMBED_CODE"
    width="100%"
    height="300"
    style="border:0;"
    allowfullscreen=""
    loading="lazy">
</iframe>
```

### Implémenter un système de paiement
Pour accepter des paiements en ligne, vous pouvez intégrer :
- [Stripe](https://stripe.com/)
- [PayPal](https://www.paypal.com/fr/business)
- [Square](https://squareup.com/)

### Ajouter un blog
Créez un dossier `blog/` avec des pages HTML pour partager des conseils bien-être.

## 🎯 SEO & Performance

### Optimisation SEO
1. **Meta tags** : Déjà inclus dans `index.html`
2. **Sitemap** : Créez un fichier `sitemap.xml`
3. **Robots.txt** : Créez un fichier `robots.txt`
4. **Images** : Compressez vos images avec [TinyPNG](https://tinypng.com/)
5. **Alt text** : Ajoutez des descriptions alt sur toutes les images

### Performance
- **Minification** : Minifiez CSS et JS en production
- **CDN** : Utilisez un CDN pour les librairies externes
- **Lazy loading** : Déjà implémenté pour les images
- **Cache** : Configurez le cache du serveur

## 📱 Tests

### Navigateurs testés
- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

### Responsive
Testez sur différentes tailles d'écran :
- Mobile : 320px - 480px
- Tablette : 481px - 768px
- Desktop : 769px+

### Outils de test
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

## 🚀 Mise en ligne

### Option 1 : GitHub Pages (Gratuit)
1. Créez un repository GitHub
2. Uploadez tous les fichiers
3. Allez dans Settings > Pages
4. Sélectionnez la branche main
5. Votre site sera accessible à `username.github.io/repository`

### Option 2 : Netlify (Gratuit)
1. Créez un compte sur [Netlify](https://www.netlify.com/)
2. Glissez-déposez votre dossier
3. Le site est en ligne !

### Option 3 : Hébergement web classique
1. Choisissez un hébergeur (OVH, Ionos, o2switch, etc.)
2. Uploadez les fichiers via FTP
3. Configurez votre nom de domaine

## 📝 Mentions légales

N'oubliez pas d'ajouter :
- **Mentions légales** : Informations légales obligatoires
- **Politique de confidentialité** : RGPD
- **CGV** : Conditions générales de vente
- **Cookies** : Bannière de consentement si nécessaire

Vous pouvez utiliser des générateurs en ligne :
- [générateur de mentions légales](https://www.subdelirium.com/generateur-de-mentions-legales/)

## 🎨 Crédits

- **Fonts** : Google Fonts (Cormorant Garamond, Montserrat)
- **Icônes** : Font Awesome 6
- **Design** : Conçu sur mesure avec amour ❤️

## 📞 Support

Pour toute question ou personnalisation, n'hésitez pas à demander de l'aide !

## ✅ Nouvelles Fonctionnalités (2024)

### 🎉 Système de Réservation Avancé
- [x] **Calendrier interactif** avec créneaux disponibles en temps réel
- [x] **Système de gestion des créneaux** - Les créneaux peuvent être activés/désactivés par jour et par heure
- [x] **Interface d'administration** complète pour gérer les disponibilités
- [x] **Export Apple Calendar (.ics)** - Les clients peuvent télécharger leurs réservations au format .ics
- [x] **Compatible Google Calendar, Outlook** - Support universel des fichiers iCalendar

### 👤 Espace Client
- [x] **Connexion par email** - Les clients accèdent à leur espace avec leur email
- [x] **Historique des réservations** - Vue complète de toutes les réservations (passées, à venir, annulées)
- [x] **Statistiques personnelles** - Nombre de réservations, statuts, etc.
- [x] **Annulation en ligne** - Les clients peuvent annuler leurs réservations
- [x] **Téléchargement .ics** - Export des réservations vers calendriers personnels

### 🔐 Administration
- [x] **Tableau de bord** avec statistiques en temps réel
- [x] **Gestion des créneaux** - Activer/désactiver les créneaux par jour ou individuellement
- [x] **Liste des réservations** - Filtres (toutes, à venir, passées, annulées)
- [x] **Export des données** - Sauvegarde complète au format JSON
- [x] **Système sécurisé** - Authentification par mot de passe

### 🎨 Interface & UX
- [x] **Mode sombre** - Basculez entre mode clair et sombre
- [x] **Design amélioré** - Animations fluides et interface moderne
- [x] **Modal de confirmation** - Confirmation visuelle après réservation
- [x] **Notifications toast** - Feedback utilisateur en temps réel
- [x] **100% responsive** - Optimisé pour tous les appareils

### 📱 Compatibilité Calendrier
- ✅ Apple Calendar (iPhone, iPad, Mac)
- ✅ Google Calendar (Android, Web)
- ✅ Outlook Calendar (Windows, Mac, Web)
- ✅ Yahoo Calendar
- ✅ Tout client supportant le format iCalendar (.ics)

## 🔄 Mises à jour futures

Idées d'améliorations :
- [x] Système de blog intégré ✅
- [x] Paiement en ligne (Stripe, PayPal) ✅
- [x] Système de fidélité avec points ✅
- [x] Newsletter avec stockage local ✅
- [x] Multilingue (FR/EN) ✅
- [x] Notifications par email (EmailJS) ✅
- [x] Système de rappels automatiques ✅
- [x] Google Maps intégration ✅
- [x] Google Analytics intégration ✅

**Toutes les fonctionnalités planifiées sont maintenant implémentées !** 🎉

## 📄 Licence

Ce projet est fourni tel quel pour un usage personnel et commercial.

---

**Fait avec 💚 pour votre succès dans le bien-être !**

### 📝 Blog & Newsletter
- [x] **Blog intégré** - Articles par catégories (massages, aromathérapie, bien-être, nutrition)
- [x] **Recherche d'articles** - Recherche par mots-clés
- [x] **Newsletter** - Inscription avec stockage local

### 🎁 Programme de Fidélité
- [x] **Système de points** - 1 point par 10€ dépensés
- [x] **4 niveaux** - Bronze, Argent, Or, Platine
- [x] **Récompenses** - Réductions et massages gratuits débloquables
- [x] **Avantages par niveau** - Réductions automatiques selon le niveau

### 🌍 Multilingue
- [x] **Français/Anglais** - Système de traduction intégré
- [x] **Toggle langue** - Bouton de changement de langue dans la navigation
- [x] **Sauvegarde préférence** - La langue est sauvegardée dans le navigateur

### 📧 Notifications Email (EmailJS)
- [x] **Configuration EmailJS** - Système prêt à l'emploi
- [x] **Confirmation réservation** - Email automatique après réservation
- [x] **Rappels 24h avant** - Système de rappels automatiques
- [x] **Newsletter** - Email de bienvenue pour nouveaux abonnés

## 🔄 Fonctionnalités prêtes à activer

- [x] **Paiement en ligne** - Stripe/PayPal ✅ (configuration à compléter)
- [x] **EmailJS** - Remplacer les IDs dans `js/emailjs-config.js` ✅
- [x] **Google Maps** - Ajouter votre embed code ✅
- [x] **Analytics** - Ajouter Google Analytics ID ✅

## 💳 Configuration du Système de Paiement

### Stripe

1. Créez un compte sur [Stripe](https://stripe.com/)
2. Obtenez vos clés API depuis le Dashboard
3. Dans `js/payment.js`, remplacez :
   ```javascript
   STRIPE_PUBLIC_KEY: 'pk_test_VOTRE_CLE_STRIPE'
   ```
4. **Important** : Vous devez avoir un backend pour créer les PaymentIntents
   - Voir les instructions dans `js/payment.js` (lignes 468-480)

### PayPal

1. Créez un compte Business sur [PayPal](https://www.paypal.com/)
2. Obtenez votre Client ID depuis le Dashboard
3. Dans `js/payment.js`, remplacez :
   ```javascript
   PAYPAL_CLIENT_ID: 'VOTRE_CLIENT_ID_PAYPAL'
   ```
4. Dans `index.html` (ligne 721), remplacez :
   ```html
   client-id=YOUR_PAYPAL_CLIENT_ID
   ```

### Utilisation

Pour afficher le modal de paiement dans votre code :
```javascript
window.paymentSystem.showPaymentModal(bookingData, amount);
```

## 🗺️ Configuration de Google Maps

1. Allez sur [Google Maps](https://www.google.com/maps)
2. Cherchez votre adresse
3. Cliquez sur "Partager" > "Intégrer une carte"
4. Copiez le code iframe
5. Dans `index.html` (ligne 630), remplacez l'URL `src` par votre URL

## 📊 Configuration de Google Analytics

1. Créez un compte sur [Google Analytics](https://analytics.google.com/)
2. Créez une propriété pour votre site
3. Obtenez votre Measurement ID (format: G-XXXXXXXXXX)
4. Dans `index.html` (ligne 18), remplacez :
   ```javascript
   'GA_MEASUREMENT_ID'
   ```
   Par votre vrai ID aux deux endroits


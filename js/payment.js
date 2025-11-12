// ===================================
// PAYMENT SYSTEM - Stripe & PayPal
// ===================================

/*
CONFIGURATION STRIPE & PAYPAL:

Pour activer les paiements en ligne :

1. STRIPE:
   - Créez un compte sur https://stripe.com/
   - Obtenez vos clés API (Publishable Key et Secret Key)
   - Remplacez STRIPE_PUBLIC_KEY ci-dessous

2. PAYPAL:
   - Créez un compte Business sur https://www.paypal.com/
   - Obtenez votre Client ID depuis le Dashboard
   - Remplacez PAYPAL_CLIENT_ID ci-dessous

3. Chargez les SDKs dans index.html (voir instructions en bas de ce fichier)
*/

const PAYMENT_CONFIG = {
    STRIPE_PUBLIC_KEY: 'pk_test_VOTRE_CLE_STRIPE', // Remplacez par votre clé Stripe
    PAYPAL_CLIENT_ID: 'VOTRE_CLIENT_ID_PAYPAL',    // Remplacez par votre Client ID PayPal
    CURRENCY: 'EUR',
    MODE: 'test' // 'test' ou 'live'
};

// ===================================
// STRIPE PAYMENT
// ===================================

let stripe = null;
let stripeElements = null;
let cardElement = null;

function initStripe() {
    if (typeof Stripe === 'undefined') {
        console.log('Stripe SDK not loaded');
        return false;
    }

    if (PAYMENT_CONFIG.STRIPE_PUBLIC_KEY === 'pk_test_VOTRE_CLE_STRIPE') {
        console.log('Stripe not configured. Please add your API keys.');
        return false;
    }

    stripe = Stripe(PAYMENT_CONFIG.STRIPE_PUBLIC_KEY);
    stripeElements = stripe.elements();

    // Create card element
    cardElement = stripeElements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '"Montserrat", sans-serif',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    });

    return true;
}

async function processStripePayment(amount, bookingData) {
    if (!initStripe()) {
        throw new Error('Stripe not initialized');
    }

    try {
        // Create payment intent on your backend
        // This is a simulation - you need a real backend endpoint
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount * 100, // Convert to cents
                currency: PAYMENT_CONFIG.CURRENCY,
                bookingData: bookingData
            })
        });

        const { clientSecret } = await response.json();

        // Confirm the payment
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${bookingData.prenom} ${bookingData.nom}`,
                    email: bookingData.email,
                    phone: bookingData.telephone
                }
            }
        });

        if (result.error) {
            throw new Error(result.error.message);
        }

        return {
            success: true,
            paymentId: result.paymentIntent.id,
            status: result.paymentIntent.status
        };
    } catch (error) {
        console.error('Stripe payment error:', error);
        throw error;
    }
}

// ===================================
// PAYPAL PAYMENT
// ===================================

let paypalLoaded = false;

function initPayPal(containerId, amount, bookingData, onSuccess, onError) {
    if (typeof paypal === 'undefined') {
        console.log('PayPal SDK not loaded');
        return false;
    }

    if (PAYMENT_CONFIG.PAYPAL_CLIENT_ID === 'VOTRE_CLIENT_ID_PAYPAL') {
        console.log('PayPal not configured. Please add your Client ID.');
        return false;
    }

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toFixed(2),
                        currency_code: PAYMENT_CONFIG.CURRENCY
                    },
                    description: `Réservation - ${window.bookingSystem.getServiceName(bookingData.service)}`,
                    custom_id: bookingData.id || 'booking-' + Date.now()
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                onSuccess({
                    success: true,
                    paymentId: details.id,
                    status: details.status,
                    payer: details.payer
                });
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            onError(err);
        },
        onCancel: function(data) {
            console.log('Payment cancelled', data);
            onError(new Error('Payment cancelled'));
        }
    }).render('#' + containerId);

    paypalLoaded = true;
    return true;
}

// ===================================
// PAYMENT MODAL
// ===================================

function showPaymentModal(bookingData, amount) {
    const serviceName = window.bookingSystem.getServiceName(bookingData.service);
    const formattedDate = new Date(bookingData.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const modalHTML = `
        <div class="payment-modal" id="paymentModal">
            <div class="payment-modal-content">
                <button class="payment-modal-close" id="closePaymentModal">
                    <i class="fas fa-times"></i>
                </button>

                <div class="payment-header">
                    <h2><i class="fas fa-credit-card"></i> Paiement sécurisé</h2>
                    <p>Finalisez votre réservation</p>
                </div>

                <div class="payment-summary">
                    <h3>Résumé de votre réservation</h3>
                    <div class="payment-summary-item">
                        <span><i class="fas fa-spa"></i> Service</span>
                        <strong>${serviceName}</strong>
                    </div>
                    <div class="payment-summary-item">
                        <span><i class="fas fa-calendar"></i> Date</span>
                        <strong>${formattedDate} à ${bookingData.time}</strong>
                    </div>
                    <div class="payment-summary-item">
                        <span><i class="fas fa-clock"></i> Durée</span>
                        <strong>${bookingData.duration} minutes</strong>
                    </div>
                    <div class="payment-summary-total">
                        <span>Total à payer</span>
                        <strong class="payment-amount">${amount.toFixed(2)} €</strong>
                    </div>
                </div>

                <div class="payment-methods">
                    <div class="payment-method-tabs">
                        <button class="payment-tab active" data-method="stripe">
                            <i class="fab fa-cc-stripe"></i> Carte bancaire
                        </button>
                        <button class="payment-tab" data-method="paypal">
                            <i class="fab fa-paypal"></i> PayPal
                        </button>
                    </div>

                    <div class="payment-method-content">
                        <!-- Stripe Card Payment -->
                        <div id="stripePayment" class="payment-panel active">
                            <div class="payment-info">
                                <i class="fas fa-lock"></i>
                                Paiement 100% sécurisé via Stripe
                            </div>
                            <div id="card-element" class="card-element"></div>
                            <div id="card-errors" class="payment-errors"></div>
                            <button id="submitStripePayment" class="btn btn-primary btn-full">
                                <i class="fas fa-lock"></i> Payer ${amount.toFixed(2)} €
                            </button>
                        </div>

                        <!-- PayPal Payment -->
                        <div id="paypalPayment" class="payment-panel">
                            <div class="payment-info">
                                <i class="fas fa-lock"></i>
                                Paiement 100% sécurisé via PayPal
                            </div>
                            <div id="paypal-button-container"></div>
                        </div>
                    </div>
                </div>

                <div class="payment-footer">
                    <p><i class="fas fa-shield-alt"></i> Vos données sont protégées et chiffrées</p>
                </div>
            </div>
        </div>
    `;

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize payment methods
    setupPaymentModal(bookingData, amount);
}

function setupPaymentModal(bookingData, amount) {
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.getElementById('closePaymentModal');
    const tabs = document.querySelectorAll('.payment-tab');
    const panels = document.querySelectorAll('.payment-panel');

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.dataset.method;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${method}Payment`).classList.add('active');

            // Initialize PayPal on first click
            if (method === 'paypal' && !paypalLoaded) {
                initPayPal(
                    'paypal-button-container',
                    amount,
                    bookingData,
                    handlePaymentSuccess,
                    handlePaymentError
                );
            }
        });
    });

    // Initialize Stripe
    if (initStripe()) {
        cardElement.mount('#card-element');

        // Handle Stripe payment
        document.getElementById('submitStripePayment').addEventListener('click', async () => {
            const button = document.getElementById('submitStripePayment');
            const originalText = button.innerHTML;

            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';

            try {
                const result = await processStripePayment(amount, bookingData);
                handlePaymentSuccess(result);
            } catch (error) {
                handlePaymentError(error);
                button.disabled = false;
                button.innerHTML = originalText;
            }
        });

        // Handle Stripe errors
        cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    } else {
        document.getElementById('stripePayment').innerHTML = `
            <div class="payment-not-configured">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Le paiement par carte n'est pas encore configuré.</p>
                <p><small>Veuillez contacter l'administrateur.</small></p>
            </div>
        `;
    }
}

function handlePaymentSuccess(result) {
    console.log('Payment successful:', result);

    // Close payment modal
    document.getElementById('paymentModal')?.remove();

    // Show success message
    showNotification('Paiement réussi ! Votre réservation est confirmée.', 'success');

    // You can store payment info in booking
    // window.bookingSystem.updateBookingPayment(bookingId, result);

    // Show booking confirmation
    setTimeout(() => {
        window.location.href = 'client.html';
    }, 2000);
}

function handlePaymentError(error) {
    console.error('Payment error:', error);
    showNotification('Erreur lors du paiement. Veuillez réessayer.', 'error');
}

// ===================================
// PRICE CALCULATOR
// ===================================

function calculatePrice(service, duration, loyaltyLevel = 'bronze') {
    // Base prices
    const prices = {
        'massage-suedois': 75,
        'massage-californien': 75,
        'massage-sportif': 75,
        'reflexologie': 45,
        'pierres-chaudes': 110,
        'olfactotherapie': 75
    };

    let basePrice = prices[service] || 75;

    // Adjust for duration (if different from standard)
    // You can implement duration-based pricing here

    // Apply loyalty discount
    const loyaltyDiscounts = {
        'bronze': 0,
        'silver': 0.05,
        'gold': 0.10,
        'platinum': 0.15
    };

    const discount = loyaltyDiscounts[loyaltyLevel] || 0;
    const finalPrice = basePrice * (1 - discount);

    return {
        basePrice: basePrice,
        discount: discount * 100,
        finalPrice: finalPrice
    };
}

// ===================================
// EXPORT
// ===================================

window.paymentSystem = {
    showPaymentModal,
    calculatePrice,
    initStripe,
    initPayPal,
    PAYMENT_CONFIG
};

/*
INSTRUCTIONS D'INSTALLATION:

1. Ajoutez ces scripts dans index.html AVANT </body>:

<!-- Stripe -->
<script src="https://js.stripe.com/v3/"></script>

<!-- PayPal -->
<script src="https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID&currency=EUR"></script>

<!-- Payment System -->
<script src="js/payment.js"></script>

2. Remplacez VOTRE_CLIENT_ID par votre vrai Client ID PayPal

3. Configurez vos clés API dans PAYMENT_CONFIG (lignes 18-22)

4. IMPORTANT: Pour Stripe, vous devez avoir un backend pour créer les PaymentIntents
   Exemple backend (Node.js/Express):

   app.post('/api/create-payment-intent', async (req, res) => {
       const { amount, currency } = req.body;
       const paymentIntent = await stripe.paymentIntents.create({
           amount,
           currency
       });
       res.json({ clientSecret: paymentIntent.client_secret });
   });

5. Pour PayPal, le SDK gère tout côté client (plus simple)

6. Testez en mode sandbox avant de passer en production
*/

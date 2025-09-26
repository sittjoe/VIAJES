const summaryForm = document.getElementById('summaryForm');
const paymentForm = document.getElementById('paymentForm');
const contactForm = document.getElementById('contactForm');
const previewDestination = document.getElementById('previewDestination');
const previewDates = document.getElementById('previewDates');
const previewHotel = document.getElementById('previewHotel');
const previewActivities = document.getElementById('previewActivities');
const previewTotal = document.getElementById('previewTotal');
const securePanel = document.getElementById('securePanel');
const secureData = securePanel.querySelector('.secure-data');
const secureName = document.getElementById('secureName');
const secureCard = document.getElementById('secureCard');
const secureExpiry = document.getElementById('secureExpiry');
const revealButton = document.getElementById('revealButton');
const thanksMessage = document.getElementById('thanksMessage');
const paymentStatus = document.getElementById('paymentStatus');
const contactStatus = document.getElementById('contactStatus');

const PAYMENT_FORM_ENDPOINT = 'https://formspree.io/f/tu_form_id';
const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/tu_form_contacto_id';

const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    const number = Number(value);
    if (Number.isNaN(number)) return '';
    return number.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
};

const maskCardNumber = (cardNumber) => {
    const digits = cardNumber.replace(/\D/g, '');
    if (!digits) return '';
    const maskedSection = digits.slice(-4).padStart(digits.length, '•');
    return maskedSection.replace(/(.{4})/g, '$1 ').trim();
};

const formatCardInput = (input) => {
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    input.value = formatted;
};

const formatExpiryInput = (input) => {
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
        input.value = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
        input.value = digits;
    }
};

summaryForm.addEventListener('input', () => {
    const data = new FormData(summaryForm);
    previewDestination.textContent = data.get('destination') || 'París, Francia';
    previewDates.textContent = data.get('dates') || '12 - 20 Julio 2024';
    previewHotel.textContent = data.get('hotel') || 'Hotel Boutique Lumière';

    const activities = (data.get('activities') || 'Tour gastronómico\nCrucero por el Sena\nMuseo del Louvre')
        .split(/\n|,/)
        .map(item => item.trim())
        .filter(Boolean);

    previewActivities.innerHTML = '';
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.textContent = activity;
        previewActivities.appendChild(li);
    });

    const formattedTotal = formatCurrency(data.get('total'));
    previewTotal.textContent = formattedTotal ? `${formattedTotal} USD` : '$2,850.00 USD';
});

summaryForm.dispatchEvent(new Event('input'));

paymentForm.cardNumber.addEventListener('input', () => formatCardInput(paymentForm.cardNumber));
paymentForm.expiry.addEventListener('input', () => formatExpiryInput(paymentForm.expiry));

const updateStatus = (node, message, modifier) => {
    if (!node) return;
    node.textContent = message;
    node.className = modifier ? `form-status ${modifier}` : 'form-status';
};

const handleSubmission = async ({ endpoint, payload, statusNode, successMessage }) => {
    if (!endpoint || endpoint.includes('tu_form')) {
        updateStatus(statusNode, 'Configura tu endpoint de Formspree en script.js antes de enviar.', 'warning');
        return false;
    }

    updateStatus(statusNode, 'Enviando…', 'pending');

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: payload
        });

        if (!response.ok) {
            throw new Error('No se pudo enviar la información');
        }

        updateStatus(statusNode, successMessage, 'success');
        return true;
    } catch (error) {
        updateStatus(statusNode, 'Ocurrió un error al enviar. Intenta nuevamente o contáctame directamente.', 'error');
        console.error(error);
        return false;
    }
};

paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const summaryData = new FormData(summaryForm);
    const paymentData = new FormData(paymentForm);
    const payload = new FormData();

    summaryData.forEach((value, key) => {
        payload.append(`resumen_${key}`, value);
    });

    paymentData.forEach((value, key) => {
        payload.append(key, value);
    });

    payload.append('_subject', 'Nuevo carrito de viaje confirmado');
    payload.append('_template', 'table');

    const cardNumber = paymentData.get('cardNumber');

    const wasSuccessful = await handleSubmission({
        endpoint: PAYMENT_FORM_ENDPOINT,
        payload,
        statusNode: paymentStatus,
        successMessage: '¡Datos enviados! Revisa tu panel o correo para confirmarlos.'
    });

    if (!wasSuccessful) {
        return;
    }

    secureName.textContent = paymentData.get('cardName');
    secureCard.textContent = maskCardNumber(cardNumber);
    secureExpiry.textContent = paymentData.get('expiry');

    secureData.hidden = false;
    revealButton.hidden = false;
    thanksMessage.hidden = false;

    paymentForm.reset();
});

revealButton.addEventListener('click', () => {
    secureData.classList.toggle('is-visible');
    if (secureData.classList.contains('is-visible')) {
        revealButton.textContent = 'Ocultar datos';
        secureData.style.background = 'rgba(255, 255, 255, 0.12)';
    } else {
        revealButton.textContent = 'Mostrar datos enmascarados';
        secureData.style.background = 'rgba(255, 255, 255, 0.06)';
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        formData.append('_subject', 'Nuevo mensaje desde la landing de viajes');

        const wasSuccessful = await handleSubmission({
            endpoint: CONTACT_FORM_ENDPOINT,
            payload: formData,
            statusNode: contactStatus,
            successMessage: 'Mensaje enviado. Te responderé en breve.'
        });

        if (wasSuccessful) {
            contactForm.reset();
        }
    });
}

const summaryForm = document.getElementById('summaryForm');
const paymentForm = document.getElementById('paymentForm');
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

paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(paymentForm);
    const cardNumber = data.get('cardNumber');

    secureName.textContent = data.get('cardName');
    secureCard.textContent = maskCardNumber(cardNumber);
    secureExpiry.textContent = data.get('expiry');

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

let previousActiveElement;

// Gestion de la modale
export function displayModal(photographerName) {
    const modal = document.getElementById('contact_modal');
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('modalPhotographerName').textContent = photographerName;
    previousActiveElement = document.activeElement;
    document.querySelector('.close-button').focus();
    document.body.style.overflow = 'hidden';
    modal.addEventListener('keydown', trapFocus);
}

function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    previousActiveElement.focus();
    modal.removeEventListener('keydown', trapFocus);
}

document.querySelector('.contact_button').addEventListener('click', displayModal);
document.querySelector('.close-button').addEventListener('click', closeModal);

function trapFocus(e) {
    if (e.key === 'Escape') closeModal();

    const focusable = document.querySelectorAll(
        '#contact_modal button, #contact_modal input, #contact_modal textarea'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

// Validation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        resetValidationStates();
        
        if (!validateForm()) {
            // Animation globale si échec
            contactForm.querySelectorAll('.invalid').forEach(field => {
                field.style.animation = 'aggressive-shake 1s';
            });
        } else {
            console.log('Formulaire valide', getFormData());
            contactForm.reset();
            closeModal();
        }
    });

    // Validation en temps réel
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) validateField(field);
        });
    });
});

// Fonctions de validation
function validateForm() {
    let isValid = true;
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    return isValid;
}

function validateField(field) {
    const errorMsg = field.nextElementSibling;
    
    if (!field.checkValidity()) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
        if (errorMsg) {
            errorMsg.classList.add('visible');
            errorMsg.setAttribute('aria-live', 'assertive');
            errorMsg.textContent = getErrorMessage(field);
        }
        return false;
    }
    
    field.classList.remove('invalid');
    field.setAttribute('aria-invalid', 'false');
    if (errorMsg) errorMsg.classList.remove('visible');
    return true;
}

function getErrorMessage(field) {
    if (field.validity.valueMissing) return 'Champ obligatoire';
    if (field.validity.typeMismatch) return 'Format invalide';
    if (field.validity.tooShort) return `Min. ${field.minLength} caractères`;
    return 'Erreur de saisie';
}

function resetValidationStates() {
    document.querySelectorAll('#contactForm .invalid').forEach(field => {
        field.classList.remove('invalid');
        field.style.animation = '';
    });
    document.querySelectorAll('#contactForm .error-message').forEach(msg => {
        msg.classList.remove('visible');
    });
}

function getFormData() {
    const form = document.getElementById('contactForm');
    return {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        message: form.message.value
    };
}

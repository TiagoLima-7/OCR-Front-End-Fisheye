// Variable pour mémoriser l'élément qui avait le focus avant ouverture de la modale
let previousActiveElement;

/**
 * Affiche la modale de contact et prépare l'accessibilité
 * @param {string} photographerName - Le nom du photographe à afficher dans la modale
 */
export function displayModal(photographerName) {
    const modal = document.getElementById('contact_modal');
    modal.hidden = false; // Affiche la modale
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
    // Associe la modale à un label dynamique pour l'accessibilité
    modal.setAttribute('aria-labelledby', 'Contact form for ' + photographerName);
    // Met à jour le titre affiché dans la modale
    document.getElementById('modalPhotographerName').textContent = "Contactez-moi " + photographerName;
    // Sauvegarde l'élément qui avait le focus avant ouverture
    previousActiveElement = document.activeElement;
    // Met le focus sur le premier champ du formulaire dès l'ouverture
    setTimeout(() => {
        const firstInput = modal.querySelector('input, textarea, button');
        if (firstInput) firstInput.focus();
    }, 0);
    // Désactive le scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';
    // Cache le contenu principal aux lecteurs d'écran
    document.getElementById('main').setAttribute('aria-hidden', 'true');
    // Active le piège à focus dans la modale
    document.addEventListener('keydown', trapFocus, true);
}

/**
 * Ferme la modale de contact et restaure l'état initial
 */
function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.hidden = true; // Cache la modale
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Réactive le scroll
    // Réaffiche le contenu principal aux lecteurs d'écran
    document.getElementById('main').setAttribute('aria-hidden', 'false');
    // Restaure le focus à l'élément précédent
    if (previousActiveElement) previousActiveElement.focus();
    // Désactive le piège à focus
    document.removeEventListener('keydown', trapFocus, true);
}

// Ajoute le gestionnaire de fermeture sur le bouton X de la modale
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.close-button').addEventListener('click', closeModal);
});

/**
 * Piège le focus dans la modale et gère la touche Escape pour fermeture
 * @param {KeyboardEvent} e
 */
function trapFocus(e) {
    const modal = document.getElementById('contact_modal');
    if (modal.hidden) return; // Ne rien faire si la modale est cachée

    // Ferme la modale si on appuie sur Escape
    if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
    }

    // Gère le focus trap si on appuie sur Tab ou Shift+Tab
    if (e.key === 'Tab') {
        // Sélecteurs des éléments focusables
        const focusableSelectors = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            'iframe',
            'object',
            'embed',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable]'
        ];
        // Liste des éléments focusables visibles dans la modale
        const focusable = Array.from(modal.querySelectorAll(focusableSelectors.join(',')))
            .filter(el => el.offsetParent !== null);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        // Si focus perdu hors de la modale, on le remet au premier élément
        if (!modal.contains(document.activeElement)) {
            first.focus();
            e.preventDefault();
            return;
        }

        // Si Tab sur le dernier, revient au premier (boucle)
        if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
        // Si Shift+Tab sur le premier, revient au dernier (boucle)
        else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    }
}

// =========================
// Validation du formulaire
// =========================

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    // Validation au submit
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        resetValidationStates();

        if (!validateForm()) {
            // Anime les champs invalides si le formulaire est incorrect
            contactForm.querySelectorAll('.invalid').forEach(field => {
                field.style.animation = 'aggressive-shake 1s';
            });
        } else {
            // Ici tu peux envoyer les données, afficher un message, etc.
            console.log('Formulaire valide', getFormData());
            contactForm.reset();
            closeModal();
        }
    });

    // Validation en temps réel sur chaque champ
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) validateField(field);
        });
    });
});

/**
 * Valide tout le formulaire
 * @returns {boolean} true si tout est valide, false sinon
 */
function validateForm() {
    let isValid = true;
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    return isValid;
}

/**
 * Valide un champ individuel, affiche les messages d'erreur si besoin
 * @param {HTMLElement} field - Champ à valider
 * @returns {boolean} true si valide, false sinon
 */
function validateField(field) {
    const errorMsg = field.nextElementSibling;

    if (!field.checkValidity()) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
        if (errorMsg) {
            errorMsg.classList.add('visible');
            errorMsg.setAttribute('aria-live', 'assertive');
            errorMsg.setAttribute('role', 'alert');
            errorMsg.textContent = getErrorMessage(field);
        }
        // Lier le champ à son message d'erreur pour les lecteurs d'écran
        field.setAttribute('aria-describedby', errorMsg.id || (errorMsg.id = field.id + '-error'));
        return false;
    }

    // Si valide, retire les styles d'erreur
    field.classList.remove('invalid');
    field.setAttribute('aria-invalid', 'false');
    if (errorMsg) {
        errorMsg.classList.remove('visible');
        errorMsg.removeAttribute('role');
        errorMsg.textContent = '';
    }
    field.removeAttribute('aria-describedby');
    return true;
}

/**
 * Retourne le message d'erreur adapté selon la validité du champ
 * @param {HTMLElement} field
 * @returns {string}
 */
function getErrorMessage(field) {
    if (field.validity.valueMissing) return 'Champ obligatoire';
    if (field.validity.typeMismatch) return 'Format invalide';
    if (field.validity.tooShort) return `Min. ${field.minLength} caractères`;
    return 'Erreur de saisie';
}

/**
 * Réinitialise tous les états d'erreur du formulaire
 */
function resetValidationStates() {
    document.querySelectorAll('#contactForm .invalid').forEach(field => {
        field.classList.remove('invalid');
        field.style.animation = '';
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
    document.querySelectorAll('#contactForm .error-message').forEach(msg => {
        msg.classList.remove('visible');
        msg.removeAttribute('role');
        msg.textContent = '';
    });
}

/**
 * Récupère les valeurs du formulaire sous forme d'objet
 * @returns {Object} - Les données du formulaire
 */
function getFormData() {
    const form = document.getElementById('contactForm');
    return {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        message: form.message.value
    };
}

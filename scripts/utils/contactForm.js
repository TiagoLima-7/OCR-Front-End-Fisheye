let previousActiveElement;

function displayModal(photographerName) {
    const modal = document.getElementById('contact_modal');
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    
    // Ajout du nom du photographe
    document.getElementById('modalPhotographerName').textContent = photographerName;
    
    // Sauvegarde de l'élément actif
    previousActiveElement = document.activeElement;
    
    // Gestion du focus
    document.querySelector('.close-button').focus();
    
    // Empêcher le défilement de la page
    document.body.style.overflow = 'hidden';
    
    // Ajouter l'écouteur clavier
    modal.addEventListener('keydown', trapFocus);
}

function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    
    // Restaurer le défilement
    document.body.style.overflow = '';
    
    // Restaurer le focus
    previousActiveElement.focus();
    
    // Nettoyer les écouteurs
    modal.removeEventListener('keydown', trapFocus);
}

function trapFocus(e) {
    const modal = document.getElementById('contact_modal');
    const focusable = modal.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (e.key === 'Escape') {
        closeModal();
        return;
    }

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

// Gestion du formulaire
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Données du formulaire:', data);
    e.target.reset();
    closeModal();
});

// Validation en temps réel
document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur', () => validateField(field));
});

function validateField(field) {
    const error = field.nextElementSibling;
    
    if (field.validity.valid) {
        error.textContent = '';
        error.style.display = 'none';
    } else {
        showError(field, error);
    }
}

function showError(field, error) {
    error.style.display = 'block';
    
    if (field.validity.valueMissing) {
        error.textContent = 'Ce champ est obligatoire';
    } else if (field.validity.typeMismatch) {
        error.textContent = field.id === 'email' 
            ? 'Format email invalide' 
            : 'Format incorrect';
    }
}

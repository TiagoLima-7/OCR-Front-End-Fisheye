/**
 * Page photographe - Gestion de l'affichage d'un profil de photographe et de sa galerie
 * Importe les dépendances nécessaires
 */
import { PhotographerFactory } from '../templates/photographer.js';
import { displayModal } from '../utils/contactForm.js';

// Récupération de l'ID du photographe depuis l'URL
const params = new URLSearchParams(window.location.search);
const photographerID = parseInt(params.get('id'), 10);

// Variables globales
let currentPhotographer;            // Stocke l'instance du photographe actuel
let photographerMedias = [];        // Stocke tous les médias du photographe
let currentSort = 'popularity';     // Critère de tri par défaut

/**
 * Récupère les données des photographes et médias depuis le fichier JSON
 * @returns {Promise<Object>} Les données des photographes et médias
 */
async function getData() {
    try {
        const response = await fetch('./data/photographers.json');
        return await response.json();
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        return { photographers: [], media: [] };
    }
}

/**
 * Trie les médias selon le critère choisi
 * @param {Array} medias - Liste des médias à trier
 * @param {string} sortBy - Critère de tri ('popularity', 'date', 'title')
 * @returns {Array} Liste des médias triés
 */
function sortMedias(medias, sortBy) {
    switch (sortBy) {
        case 'popularity':
            return [...medias].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        case 'date':
            return [...medias].sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            return [...medias].sort((a, b) => a.title.localeCompare(b.title));
        default:
            return medias;
    }
}

/**
 * Affiche la galerie de médias triée selon le critère actuel
 */
function renderGallery() {
    // Supprimer l'ancienne galerie si elle existe
    const oldGallery = document.querySelector('.gallery-grid');
    if (oldGallery) oldGallery.remove();

    // Trier les médias selon le critère actuel
    const sortedMedias = sortMedias(photographerMedias, currentSort);

    // Créer et afficher la galerie triée via la méthode du photographe
    const gallery = currentPhotographer.createGallery(sortedMedias);
    document.querySelector('main').appendChild(gallery);

    // Reconfigurer les likes interactifs
    setupLikes();
}

/**
 * Affiche la page complète du photographe
 */
async function displayPhotographerPage() {
    // Récupération des données
    const { photographers, media } = await getData();
    const photographer = photographers.find(p => p.id === photographerID);

    // Gestion d'erreur si le photographe n'existe pas
    if (!photographer) {
        document.querySelector('main').innerHTML = `<div class="error">Photographe non trouvé</div>`;
        return;
    }

    // Création de l'instance du photographe via la factory (méthode statique)
    currentPhotographer = PhotographerFactory.createPhotographer(photographer);

    // Configuration de l'en-tête du profil
    const header = document.querySelector('.photograph-header');
    const contactButton = header.querySelector('.contact_button');
    contactButton.onclick = () => displayModal(currentPhotographer.getName());

    // Insertion des éléments du profil
    header.insertBefore(
        currentPhotographer.createProfileHeaderDOM(),
        contactButton
    );
    contactButton.insertAdjacentElement(
        'afterend',
        currentPhotographer.createProfilePictureDOM()
    );

    // Filtrer les médias du photographe
    photographerMedias = media.filter(m => m.photographerId === photographerID);

    // Afficher la galerie initiale (par popularité)
    renderGallery();

    // Affichage de la somme des likes et du prix journalier
    updatePriceAndLikes();

    // Gestion du tri (faux select)
    setupCustomSelect();
}

/**
 * Met à jour l'affichage du nombre total de likes et du prix journalier
 */
function updatePriceAndLikes() {
    // Calcul du total des likes sur les médias actuellement affichés
    const totalLikes = Array.from(document.querySelectorAll('.media-card .likes')).reduce((sum, likesEl) => {
        const countText = likesEl.childNodes[0].textContent.trim();
        const count = parseInt(countText, 10);
        return sum + (isNaN(count) ? 0 : count);
    }, 0);

    // Récupérer le prix journalier du photographe
    const pricePerDay = currentPhotographer.price || '';

    // Mise à jour de l'affichage
    const pricetagDiv = document.querySelector('.photographer-pricetag');
    pricetagDiv.innerHTML = `
        <div class="pricetag-content">
            <span class="total-likes">
                <span id="total-likes">${totalLikes}</span> <span aria-label="likes"><i class="fa-solid fa-heart"></i></span>
            </span>
            <span class="price-per-day">${pricePerDay}€ / jour</span>
        </div>
    `;
}

/**
 * Configure les interactions de like sur les médias
 */
function setupLikes() {
    // Set pour mémoriser les médias déjà likés
    const likedIndexes = new Set();
    const likeElements = document.querySelectorAll('.media-card .likes');

    /**
     * Met à jour le compteur total de likes
     */
    function updateTotalLikes() {
        let total = 0;
        document.querySelectorAll('.media-card .likes').forEach(likesEl => {
            const countText = likesEl.childNodes[0].textContent.trim();
            const count = parseInt(countText, 10);
            total += isNaN(count) ? 0 : count;
        });
        const totalLikesSpan = document.getElementById('total-likes');
        if (totalLikesSpan) {
            totalLikesSpan.textContent = total;
        }
    }

    // Configuration de chaque élément de like
    likeElements.forEach((likeEl, idx) => {
        const heartSpan = likeEl.querySelector('span');
        if (!heartSpan) return;

        const heartEmpty = heartSpan.querySelector('.fa-regular.fa-heart');
        const heartFull = heartSpan.querySelector('.fa-solid.fa-heart');

        if (!heartEmpty || !heartFull) return;

        // Par défaut, cœur plein caché
        heartFull.style.display = 'none';

        // Configuration pour l'accessibilité
        heartSpan.setAttribute('tabindex', '0');
        heartSpan.setAttribute('role', 'button');
        heartSpan.setAttribute('aria-label', 'Likes');
        heartSpan.setAttribute('aria-pressed', 'false');

        /**
         * Fonction pour ajouter un like
         */
        function like() {
            if (likedIndexes.has(idx)) return;

            // Incrémenter le compteur
            const countNode = likeEl.childNodes[0];
            let count = parseInt(countNode.textContent.trim(), 10);
            if (isNaN(count)) count = 0;
            count++;
            countNode.textContent = count + ' ';

            // Afficher le cœur plein
            heartEmpty.style.display = 'none';
            heartFull.style.display = '';

            // Mise à jour de l'état
            heartSpan.setAttribute('aria-pressed', 'true');
            likedIndexes.add(idx);
            updateTotalLikes();
        }

        // Événements pour le like
        heartSpan.addEventListener('click', like);
        heartSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                like();
                e.preventDefault();
            }
        });
    });
}


/**
 * Initialise le faux select personnalisé :
 * - Gère l'ouverture/fermeture du menu
 * - Gère la navigation clavier
 * - Met à jour les attributs ARIA pour l'accessibilité
 * - Déclenche un événement personnalisé lors du changement de sélection
 */
function setupCustomSelect() {
    // Récupère tous les éléments nécessaires du composant custom select
    const listbox = document.getElementById('sort-select'); // Le conteneur principal du faux select
    const btnSelected = listbox.querySelector('.custom-select__selected'); // Le bouton qui affiche la valeur sélectionnée
    const optionsContainer = listbox.querySelector('.custom-select__options'); // Le menu déroulant contenant les options
    const options = Array.from(optionsContainer.querySelectorAll('.custom-option')); // Tableau de toutes les options
    const selectedText = btnSelected.querySelector('#sort-selected-text'); // Le span qui affiche le texte sélectionné
    const chevronIcon = listbox.querySelector('.chevron .fa-solid'); //Le span qui affiche le chevron


    // Trouve l'index de l'option sélectionnée par défaut (aria-selected="true")
    let currentIndex = options.findIndex(opt => opt.getAttribute('aria-selected') === 'true');
    if (currentIndex === -1) currentIndex = 0; // Si aucune, sélectionne la première

    /**
     * Synchronise les attributs ARIA pour l'accessibilité :
     * - aria-activedescendant sur le listbox et la liste d'options
     * - aria-selected sur chaque option
     */
    function syncAria() {
        listbox.setAttribute('aria-activedescendant', options[currentIndex].id);
        optionsContainer.setAttribute('aria-activedescendant', options[currentIndex].id);
        options.forEach((opt, i) => {
            opt.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
        });
    }

    /**
     * Ouvre le menu déroulant :
     * - Affiche la liste
     * - Met à jour les attributs aria-expanded
     * - Met le focus sur l'option active
     */
    function openDropdown() {
        optionsContainer.hidden = false;
        listbox.setAttribute('aria-expanded', 'true');
        btnSelected.setAttribute('aria-expanded', 'true');
        optionsContainer.setAttribute('tabindex', '0');
        syncAria();
        options[currentIndex].focus();
        chevronIcon.classList.remove('fa-chevron-down');
        chevronIcon.classList.add('fa-chevron-up');

    }

    /**
     * Ferme le menu déroulant :
     * - Cache la liste
     * - Met à jour les attributs aria-expanded
     * - Restaure le focus sur le bouton si besoin
     * @param {boolean} restoreFocus - Si vrai, remet le focus sur le bouton
     */
    function closeDropdown(restoreFocus = true) {
        optionsContainer.hidden = true;
        listbox.setAttribute('aria-expanded', 'false');
        btnSelected.setAttribute('aria-expanded', 'false');
        optionsContainer.setAttribute('tabindex', '-1');
        if (restoreFocus) btnSelected.focus();
        chevronIcon.classList.remove('fa-chevron-up');
        chevronIcon.classList.add('fa-chevron-down');

    }

    /**
     * Sélectionne une option :
     * - Met à jour le texte affiché
     * - Met à jour les attributs ARIA
     * - Ferme le menu
     * - Déclenche un événement personnalisé si demandé
     * @param {number} index - Index de l'option à sélectionner
     * @param {boolean} fireEvent - Si vrai, déclenche l'événement "sortChange"
     * @param {boolean} restoreFocus - Si vrai, remet le focus sur le bouton
     */
    function selectOption(index, fireEvent = true, restoreFocus = true) {
        currentIndex = index;
        selectedText.textContent = options[index].textContent;
        syncAria();
        closeDropdown(restoreFocus);

        // Déclenche un événement personnalisé pour signaler le changement de tri
        if (fireEvent) {
            const event = new CustomEvent('sortChange', {
                detail: { value: options[index].dataset.value }
            });
            listbox.dispatchEvent(event);
        }
    }

    // Ouvre ou ferme le menu au clic sur le bouton principal
    btnSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        if (optionsContainer.hidden) {
            openDropdown();
        } else {
            closeDropdown();
        }
    });

    // Ouvre le menu au clavier (espace, entrée, flèche)
    btnSelected.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(e.key)) {
            e.preventDefault();
            openDropdown();
        }
    });

    // Navigation clavier dans la liste d'options
    optionsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            // Flèche bas : passe à l'option suivante
            e.preventDefault();
            currentIndex = (currentIndex + 1) % options.length;
            options[currentIndex].focus();
            syncAria();
        } else if (e.key === 'ArrowUp') {
            // Flèche haut : passe à l'option précédente
            e.preventDefault();
            currentIndex = (currentIndex - 1 + options.length) % options.length;
            options[currentIndex].focus();
            syncAria();
        } else if (e.key === 'Enter' || e.key === ' ') {
            // Entrée ou espace : sélectionne l'option courante
            e.preventDefault();
            selectOption(currentIndex);
        } else if (e.key === 'Escape') {
            // Escape : ferme le menu
            e.preventDefault();
            closeDropdown();
        }
    });

    // Sélectionne une option au clic
    options.forEach((opt, i) => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption(i);
        });
        // Met à jour l'index courant lors du focus (utile pour la navigation clavier)
        opt.addEventListener('focus', () => {
            currentIndex = i;
            syncAria();
        });
    });

    // Ferme le menu si clic en dehors du composant
    document.addEventListener('click', (e) => {
        if (!listbox.contains(e.target)) {
            closeDropdown();
        }
    });

    // Gère le tri lors du changement de sélection (à adapter selon ta logique métier)
    listbox.addEventListener('sortChange', (e) => {
        currentSort = e.detail.value;
        renderGallery();
        updatePriceAndLikes();
        // console.log("Tri sélectionné :", e.detail.value);
    });

    // Initialisation : sélectionne l'option par défaut sans déclencher d'événement
    selectOption(currentIndex, false, false);
}





// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', displayPhotographerPage);

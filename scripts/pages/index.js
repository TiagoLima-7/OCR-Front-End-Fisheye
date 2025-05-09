// Import de la factory qui va générer les objets et DOM des photographes
import { PhotographerFactory } from '../templates/photographer.js';

/**
 * Récupère les données des photographes depuis le fichier JSON.
 * @returns {Promise<Object>} Un objet contenant la liste des photographes.
 */
async function getPhotographers() {
    try {
        // On tente de charger le fichier JSON contenant les photographes
        const response = await fetch('data/photographers.json');
        // Si la réponse n'est pas OK (ex: 404), on lève une erreur
        if (!response.ok) throw new Error('Erreur de chargement des données');
        // On retourne le contenu JSON parsé
        return await response.json();
    } catch (error) {
        // En cas d'erreur réseau ou autre, on affiche l'erreur en console
        console.error('Erreur lors de la récupération des photographes', error);
        // On retourne un objet vide pour éviter que l'app plante
        return { photographers: [] };
    }
}

/**
 * Affiche les photographes dans la section dédiée du DOM.
 * @param {Array} photographers - La liste des photographes à afficher.
 */
async function displayData(photographers) {
    // Sélectionne la section qui accueillera les cartes photographes
    const photographersSection = document.querySelector(".photographer_section");
    // Ajoute le rôle ARIA "list" pour l'accessibilité (screen readers)
    // photographersSection.setAttribute('role', 'list');

    // Pour chaque photographe, on génère et insère sa carte
    photographers.forEach(photographer => {
        // Utilise la factory pour créer une instance de photographe
        const photographerInstance = PhotographerFactory.createPhotographer(photographer);
        // Génère le DOM de la carte photographe
        const userCardDOM = photographerInstance.createUserCardDOM();
        // // Ajoute le rôle ARIA "listitem" pour chaque carte (accessibilité)
        // userCardDOM.setAttribute('role', 'listitem');
        // Ajoute la carte à la section
        photographersSection.appendChild(userCardDOM);
    });
}

/**
 * Fonction d'initialisation principale de la page.
 * Récupère les données puis déclenche l'affichage.
 */
async function init() {
    // Récupère les photographes depuis le JSON
    const { photographers } = await getPhotographers();
    // Affiche les photographes sur la page
    displayData(photographers);
}

// Lance l'initialisation dès le chargement du script
init();

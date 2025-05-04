import { PhotographerFactory } from '../templates/photographer.js';

async function getPhotographers() {
    try {
        const response = await fetch('data/photographers.json');
        if (!response.ok) throw new Error('Erreur de chargement des données');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des photographes', error);
        return { photographers: [] };
    }
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach(photographer => {
        // Utilisation de la méthode statique de la factory
        const photographerInstance = PhotographerFactory.createPhotographer(photographer);
        const userCardDOM = photographerInstance.createUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();

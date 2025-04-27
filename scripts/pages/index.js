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
        const photographerFactory = PhotographerFactory(photographer);
        const userCardDOM = photographerFactory.createUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();

const params = new URLSearchParams(window.location.search);
const photographerID = parseInt(params.get('id'));
let currentPhotographer;

async function getData() {
    try {
        const response = await fetch('./data/photographers.json');
        return await response.json();
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        return { photographers: [], media: [] };
    }
}

async function displayPhotographerPage() {
    try {
        const { photographers, media } = await getData();
        const photographer = photographers.find(p => p.id === photographerID);

        if (!photographer) {
            console.error("Photographe non trouvé");
            return;
        }

        currentPhotographer = PhotographerFactory(photographer);
        const header = document.querySelector('.photograph-header');
        
        // Vérification cruciale avant manipulation
        if (!header) {
            console.error("Element .photograph-header non trouvé");
            return;
        }

        const contactButton = header.querySelector('.contact_button');
        
        // Vérification supplémentaire
        if (!contactButton) {
            console.error("Bouton contact non trouvé");
            return;
        }

        // Remplacement sécurisé de l'event handler
        contactButton.onclick = null; // Supprime l'ancien gestionnaire
        contactButton.addEventListener('click', () => {
            if (currentPhotographer) {
                displayModal(currentPhotographer.getName());
            } else {
                console.error("Photographe non chargé");
            }
        });

        // Insertion du header
        const profileHeader = currentPhotographer.createProfileHeaderDOM();
        if (profileHeader && contactButton.parentNode) {
            header.insertBefore(profileHeader, contactButton);
        }

        // Insertion de la photo
        const profilePicture = currentPhotographer.createProfilePictureDOM();
        if (profilePicture) {
            contactButton.insertAdjacentElement('afterend', profilePicture);
        }

        // Création de la galerie
        const photographerMedias = media.filter(m => m.photographerId === photographerID);
        const gallery = currentPhotographer.createGallery(photographerMedias);
        if (gallery) {
            document.querySelector('main').appendChild(gallery);
        }

    } catch (error) {
        console.error("Erreur dans displayPhotographerPage :", error);
    }
}

document.addEventListener('DOMContentLoaded', displayPhotographerPage);

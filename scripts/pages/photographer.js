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
    const { photographers, media } = await getData();
    const photographer = photographers.find(p => p.id === photographerID);

    if (!photographer) {
        document.querySelector('main').innerHTML = `<div class="error">Photographe non trouvé</div>`;
        return;
    }

    currentPhotographer = PhotographerFactory(photographer);
    const header = document.querySelector('.photograph-header');
    const contactButton = header.querySelector('.contact_button');

    // Modification du bouton
    contactButton.onclick = () => displayModal(currentPhotographer.getName());

    // Affichage du header
    header.insertBefore(
        currentPhotographer.createProfileHeaderDOM(), 
        contactButton
    );

    // Affichage de la photo de profil
    contactButton.insertAdjacentElement(
        'afterend', 
        currentPhotographer.createProfilePictureDOM()
    );

    // Création et affichage de la galerie
    const photographerMedias = media.filter(m => m.photographerId === photographerID);
    const gallery = currentPhotographer.createGallery(photographerMedias);
    document.querySelector('main').appendChild(gallery);
     // ---- Ajout de la somme des likes et du prix journalier ----
     const totalLikes = photographerMedias.reduce((sum, media) => sum + (media.likes || 0), 0);
     const pricePerDay = photographer.price;
 
     const pricetagDiv = document.querySelector('.photographer-pricetag');
     pricetagDiv.innerHTML = `
         <div class="pricetag-content">
             <span class="total-likes"">
                 <span id="total-likes">${totalLikes}</span> <span aria-label="likes">&#10084;</span>
             </span>
             <span class="price-per-day">${pricePerDay}€ / jour</span>
         </div>
     `;
}

document.addEventListener('DOMContentLoaded', displayPhotographerPage);

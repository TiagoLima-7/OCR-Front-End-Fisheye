// const params = new URLSearchParams(window.location.search);
// const photographerID = parseInt(params.get('id'));
// let currentPhotographer;

// async function getData() {
//     try {
//         const response = await fetch('./data/photographers.json');
//         return await response.json();
//     } catch (error) {
//         console.error("Erreur de chargement des données :", error);
//         return { photographers: [], media: [] };
//     }
// }

// async function displayPhotographerPage() {
//     const { photographers, media } = await getData();
//     const photographer = photographers.find(p => p.id === photographerID);

//     if (!photographer) {
//         document.querySelector('main').innerHTML = `<div class="error">Photographe non trouvé</div>`;
//         return;
//     }

//     currentPhotographer = PhotographerFactory(photographer);
//     const header = document.querySelector('.photograph-header');
//     const contactButton = header.querySelector('.contact_button');

//     // Modification du bouton
//     contactButton.onclick = () => displayModal(currentPhotographer.getName());

//     // Affichage du header
//     header.insertBefore(
//         currentPhotographer.createProfileHeaderDOM(), 
//         contactButton
//     );

//     // Affichage de la photo de profil
//     contactButton.insertAdjacentElement(
//         'afterend', 
//         currentPhotographer.createProfilePictureDOM()
//     );

//     // Création et affichage de la galerie
//     const photographerMedias = media.filter(m => m.photographerId === photographerID);
//     const gallery = currentPhotographer.createGallery(photographerMedias);
//     document.querySelector('main').appendChild(gallery);
//      // ---- Ajout de la somme des likes et du prix journalier ----
//      const totalLikes = photographerMedias.reduce((sum, media) => sum + (media.likes || 0), 0);
//      const pricePerDay = photographer.price;
 
//      const pricetagDiv = document.querySelector('.photographer-pricetag');
//      pricetagDiv.innerHTML = `
//          <div class="pricetag-content">
//              <span class="total-likes"">
//                  <span id="total-likes">${totalLikes}</span> <span aria-label="likes"><i class="fa-solid fa-heart"></i></span>
//              </span>
//              <span class="price-per-day">${pricePerDay}€ / jour</span>
//          </div>
//          `;

//          // Configuration des likes interactifs
//          setupLikes();

//          function setupLikes() {
//             // Set pour mémoriser les médias déjà likés (empêche double like)
//             const likedIndexes = new Set();
        
//             // Récupération de tous les éléments likes
//             const likeElements = document.querySelectorAll('.media-card .likes');
        
//             // Fonction pour recalculer et mettre à jour le total des likes affiché
//             function updateTotalLikes() {
//                 let total = 0;
//                 document.querySelectorAll('.media-card .likes').forEach(likesEl => {
//                     // Le nombre est dans le premier noeud texte de <p class="likes">
//                     const countText = likesEl.childNodes[0].textContent.trim();
//                     const count = parseInt(countText, 10);
//                     total += isNaN(count) ? 0 : count;
//                 });
//                 const totalLikesSpan = document.getElementById('total-likes');
//                 if (totalLikesSpan) {
//                     totalLikesSpan.textContent = total;
//                 }
//             }
        
//             likeElements.forEach((likeEl, idx) => {
//                 const heartSpan = likeEl.querySelector('span');
//                 if (!heartSpan) return;
        
//                 const heartEmpty = heartSpan.querySelector('.fa-regular.fa-heart');
//                 const heartFull = heartSpan.querySelector('.fa-solid.fa-heart');
        
//                 if (!heartEmpty || !heartFull) return;
        
//                 // Par défaut, cœur plein caché
//                 heartFull.style.display = 'none';
        
//                 // Rendre le span focusable et accessible comme bouton
//                 heartSpan.setAttribute('tabindex', '0');
//                 heartSpan.setAttribute('role', 'button');
//                 heartSpan.setAttribute('aria-label', 'Aimer ce média');
//                 heartSpan.setAttribute('aria-pressed', 'false');
        
//                 function like() {
//                     if (likedIndexes.has(idx)) return; // déjà liké, on bloque
        
//                     // Récupérer le nombre actuel de likes
//                     const countNode = likeEl.childNodes[0];
//                     let count = parseInt(countNode.textContent.trim(), 10);
//                     if (isNaN(count)) count = 0;
//                     count++;
//                     countNode.textContent = count + ' ';
        
//                     // Afficher le cœur plein, cacher le vide
//                     heartEmpty.style.display = 'none';
//                     heartFull.style.display = '';
        
//                     // Mise à jour aria
//                     heartSpan.setAttribute('aria-pressed', 'true');
        
//                     // Mémoriser que ce média est liké
//                     likedIndexes.add(idx);
        
//                     // Mettre à jour le total des likes
//                     updateTotalLikes();
//                 }
        
//                 // Clic souris
//                 heartSpan.addEventListener('click', like);
        
//                 // Clavier : Entrée ou Espace déclenche le like
//                 heartSpan.addEventListener('keydown', function(e) {
//                     if (e.key === 'Enter' || e.key === ' ') {
//                         like();
//                         e.preventDefault();
//                     }
//                 });
//             });
//         }
// }

// document.addEventListener('DOMContentLoaded', displayPhotographerPage);


const params = new URLSearchParams(window.location.search);
const photographerID = parseInt(params.get('id'));
let currentPhotographer;
let photographerMedias = [];
let currentSort = 'popularity';

async function getData() {
    try {
        const response = await fetch('./data/photographers.json');
        return await response.json();
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        return { photographers: [], media: [] };
    }
}

function sortMedias(medias, sortBy) {
    // Tri dynamique selon le critère choisi
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

function renderGallery() {
    // Supprimer l'ancienne galerie si elle existe
    const oldGallery = document.querySelector('.gallery-grid');
    if (oldGallery) oldGallery.remove();

    // Trier les médias selon le critère actuel
    const sortedMedias = sortMedias(photographerMedias, currentSort);

    // Créer et afficher la galerie triée
    const gallery = currentPhotographer.createGallery(sortedMedias);
    document.querySelector('main').appendChild(gallery);

    // Reconfigurer les likes interactifs
    setupLikes();
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
    contactButton.onclick = () => displayModal(currentPhotographer.getName());

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

    // Gestion du tri
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderGallery();
            updatePriceAndLikes();
        });
    }
}

function updatePriceAndLikes() {
    // Calcul du total des likes sur les médias actuellement affichés
    const totalLikes = Array.from(document.querySelectorAll('.media-card .likes')).reduce((sum, likesEl) => {
        const countText = likesEl.childNodes[0].textContent.trim();
        const count = parseInt(countText, 10);
        return sum + (isNaN(count) ? 0 : count);
    }, 0);

    // Récupérer le prix journalier du photographe
    const pricePerDay = currentPhotographer.price || '';

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

function setupLikes() {
    const likedIndexes = new Set();
    const likeElements = document.querySelectorAll('.media-card .likes');

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

    likeElements.forEach((likeEl, idx) => {
        const heartSpan = likeEl.querySelector('span');
        if (!heartSpan) return;

        const heartEmpty = heartSpan.querySelector('.fa-regular.fa-heart');
        const heartFull = heartSpan.querySelector('.fa-solid.fa-heart');

        if (!heartEmpty || !heartFull) return;

        heartFull.style.display = 'none';

        heartSpan.setAttribute('tabindex', '0');
        heartSpan.setAttribute('role', 'button');
        heartSpan.setAttribute('aria-label', 'Aimer ce média');
        heartSpan.setAttribute('aria-pressed', 'false');

        function like() {
            if (likedIndexes.has(idx)) return;

            const countNode = likeEl.childNodes[0];
            let count = parseInt(countNode.textContent.trim(), 10);
            if (isNaN(count)) count = 0;
            count++;
            countNode.textContent = count + ' ';

            heartEmpty.style.display = 'none';
            heartFull.style.display = '';

            heartSpan.setAttribute('aria-pressed', 'true');
            likedIndexes.add(idx);
            updateTotalLikes();
        }

        heartSpan.addEventListener('click', like);
        heartSpan.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                like();
                e.preventDefault();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', displayPhotographerPage);

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
                 <span id="total-likes">${totalLikes}</span> <span aria-label="likes"><i class="fa-regular fa-heart"></i></span>
             </span>
             <span class="price-per-day">${pricePerDay}€ / jour</span>
         </div>
         `;

         // Configuration des likes interactifs
         setupLikes();

         function setupLikes() {
            // Set pour mémoriser les médias déjà likés (empêche double like)
            const likedIndexes = new Set();
        
            // Récupération de tous les éléments likes
            const likeElements = document.querySelectorAll('.media-card .likes');
        
            // Fonction pour recalculer et mettre à jour le total des likes affiché
            function updateTotalLikes() {
                let total = 0;
                document.querySelectorAll('.media-card .likes').forEach(likesEl => {
                    // Le nombre est dans le premier noeud texte de <p class="likes">
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
        
                // Par défaut, cœur plein caché
                heartFull.style.display = 'none';
        
                // Rendre le span focusable et accessible comme bouton
                heartSpan.setAttribute('tabindex', '0');
                heartSpan.setAttribute('role', 'button');
                heartSpan.setAttribute('aria-label', 'Aimer ce média');
                heartSpan.setAttribute('aria-pressed', 'false');
        
                function like() {
                    if (likedIndexes.has(idx)) return; // déjà liké, on bloque
        
                    // Récupérer le nombre actuel de likes
                    const countNode = likeEl.childNodes[0];
                    let count = parseInt(countNode.textContent.trim(), 10);
                    if (isNaN(count)) count = 0;
                    count++;
                    countNode.textContent = count + ' ';
        
                    // Afficher le cœur plein, cacher le vide
                    heartEmpty.style.display = 'none';
                    heartFull.style.display = '';
        
                    // Mise à jour aria
                    heartSpan.setAttribute('aria-pressed', 'true');
        
                    // Mémoriser que ce média est liké
                    likedIndexes.add(idx);
        
                    // Mettre à jour le total des likes
                    updateTotalLikes();
                }
        
                // Clic souris
                heartSpan.addEventListener('click', like);
        
                // Clavier : Entrée ou Espace déclenche le like
                heartSpan.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        like();
                        e.preventDefault();
                    }
                });
            });
        }
}

document.addEventListener('DOMContentLoaded', displayPhotographerPage);

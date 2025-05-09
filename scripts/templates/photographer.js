// --- MediaFactory et ses classes associées ---

/**
 * Classe pour gérer la création d'une carte média de type image
 */
class MediaImage {
    /**
     * @param {Object} data - Données du média (image)
     * @param {string} photographerFolder - Nom du dossier du photographe
     * @param {number} index - Index du média dans la galerie
     */
    constructor(data, photographerFolder, index) {
        this.data = data;
        this.photographerFolder = photographerFolder;
        this.index = index;
    }

    /**
     * Génère le DOM pour une carte média image
     * @returns {HTMLElement} - La div contenant la carte média
     */
    createMediaCardDOM() {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.setAttribute('tabindex', '0');
        mediaCard.setAttribute('data-index', this.index);
        mediaCard.setAttribute('role', 'listitem');
        mediaCard.setAttribute('aria-label', `${this.data.title}, image, ${this.data.likes} likes`);

        // Structure HTML de la carte image
        mediaCard.innerHTML = `
            <img src="assets/images/${this.photographerFolder}/${this.data.image}" 
                 alt="${this.data.title}" 
                 aria-label="${this.data.title},closeup view." 
                 data-index="${this.index}">
            <div class="media-info">
                <h3>${this.data.title}</h3>
                <p class="likes">
                    ${this.data.likes}
                    <span tabindex="0" role="button" aria-label="Aimer ce média" aria-pressed="false">
                        <i class="fa-regular fa-heart" aria-hidden="true"></i>
                        <i class="fa-solid fa-heart" aria-hidden="true"></i>
                    </span>
                </p>
            </div>
        `;
        return mediaCard;
    }
}

/**
 * Classe pour gérer la création d'une carte média de type vidéo
 */
class MediaVideo {
    /**
     * @param {Object} data - Données du média (vidéo)
     * @param {string} photographerFolder - Nom du dossier du photographe
     * @param {number} index - Index du média dans la galerie
     */
    constructor(data, photographerFolder, index) {
        this.data = data;
        this.photographerFolder = photographerFolder;
        this.index = index;
    }

    /**
     * Génère le DOM pour une carte média vidéo
     * @returns {HTMLElement} - La div contenant la carte média
     */
    createMediaCardDOM() {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.setAttribute('tabindex', '0');
        mediaCard.setAttribute('data-index', this.index);
        mediaCard.setAttribute('role', 'listitem');
        mediaCard.setAttribute('aria-label', `${this.data.title}, vidéo, ${this.data.likes} likes`);

        // Structure HTML de la carte vidéo
        mediaCard.innerHTML = `
            <video width="350" height="350" data-index="${this.index}" aria-label="${this.data.title}">
                <source src="assets/images/${this.photographerFolder}/${this.data.video}" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
            </video>
            <div class="media-info">
                <h3>${this.data.title}</h3>
                <p class="likes">
                    ${this.data.likes}
                    <span tabindex="0" role="button" aria-label="Aimer ce média" aria-pressed="false">
                        <i class="fa-regular fa-heart" aria-hidden="true"></i>
                        <i class="fa-solid fa-heart" aria-hidden="true"></i>
                    </span>
                </p>
            </div>
        `;
        return mediaCard;
    }
}

/**
 * Factory pour créer le bon type de média (image ou vidéo)
 */
class MediaFactory {
    /**
     * @param {Object} media - Données du média (image ou vidéo)
     * @param {string} photographerName - Nom du photographe (pour le dossier)
     * @param {number} index - Index du média dans la galerie
     * @returns {MediaImage|MediaVideo} - Instance de la classe correspondante
     */
    constructor(media, photographerName, index) {
        // Nettoie le nom du photographe pour obtenir le nom du dossier
        const photographerFolder = photographerName.replace(/[\s-]+/g, '');
        if (media.image) {
            return new MediaImage(media, photographerFolder, index);
        } else if (media.video) {
            return new MediaVideo(media, photographerFolder, index);
        } else {
            throw new Error("Type de média inconnu");
        }
    }
}

// --- PhotographerFactory et ses classes associées ---

/**
 * Classe représentant un photographe et ses méthodes d'affichage
 */
class Photographer {
    /**
     * @param {Object} data - Données du photographe
     */
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.city = data.city;
        this.country = data.country;
        this.tagline = data.tagline;
        this.price = data.price;
        this.portrait = data.portrait;
        this.picture = `assets/images/photographers_id_photos/${data.portrait}`;
    }

    /**
     * Crée la carte DOM du photographe pour la page d'accueil
     * @returns {HTMLElement} - L'article contenant la carte
     */
    createUserCardDOM() {
        const article = document.createElement('article');

        // Lien vers la page du photographe
        const link = document.createElement('a');
        link.href = `photographer.html?id=${this.id}`;
        link.setAttribute('aria-label', `${this.name}`);

        // Portrait du photographe
        const portraitDiv = document.createElement('div');
        portraitDiv.className = 'portrait';

        const img = document.createElement('img');
        img.src = this.picture;
        img.alt = `${this.name}`;
        img.setAttribute('aria-label', `${this.name}`);

        // Nom du photographe
        const h2 = document.createElement('h2');
        h2.textContent = this.name;

        // Construction du DOM
        portraitDiv.appendChild(img);
        link.appendChild(portraitDiv);
        link.appendChild(h2);

        // Ville et pays
        const locationP = document.createElement('p');
        locationP.className = 'location';
        locationP.textContent = `${this.city}, ${this.country}`;

        // Slogan
        const sloganP = document.createElement('p');
        sloganP.className = 'slogan';
        sloganP.textContent = this.tagline;

        // Prix
        const priceSpan = document.createElement('span');
        priceSpan.className = 'price';
        priceSpan.textContent = `${this.price}€/jour`;

        // Ajout de tous les éléments à l'article
        article.appendChild(link);
        article.appendChild(locationP);
        article.appendChild(sloganP);
        article.appendChild(priceSpan);

        return article;
    }

    /**
     * Crée le header de profil du photographe (nom, localisation, slogan)
     * @returns {HTMLElement} - Le div contenant les infos du photographe
     */
    createProfileHeaderDOM() {
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('photographer-info');
        infoDiv.innerHTML = `
            <h2>${this.name}</h2>
            <p class="location">${this.city}, ${this.country}</p>
            <p class="tagline">${this.tagline}</p>
        `;
        return infoDiv;
    }

    /**
     * Crée le DOM pour la photo de profil du photographe
     * @returns {HTMLElement} - Le div contenant la photo
     */
    createProfilePictureDOM() {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo-container');
        photoContainer.innerHTML = `<img src="${this.picture}" alt="${this.name}" aria-label="${this.name}">`;
        return photoContainer;
    }

    /**
     * Crée la galerie des médias du photographe
     * @param {Array} medias - Liste des médias à afficher
     * @returns {HTMLElement} - Le div contenant la galerie
     */
    createGallery(medias) {
        const gallery = document.createElement('div');
        gallery.classList.add('gallery-grid');
        gallery.setAttribute('role', 'list');
        medias.forEach((mediaItem, index) => {
            // Utilise la MediaFactory pour chaque média
            const media = new MediaFactory(mediaItem, this.name, index);
            gallery.appendChild(media.createMediaCardDOM());
        });
        return gallery;
    }

    /**
     * Retourne le nom du photographe (utile pour d'autres modules)
     * @returns {string}
     */
    getName() {
        return this.name;
    }
}

/**
 * Factory pour créer des instances de Photographer
 */
export class PhotographerFactory {
    /**
     * Crée un photographe à partir des données fournies
     * @param {Object} data - Données du photographe
     * @returns {Photographer}
     */
    static createPhotographer(data) {
        // Ici on peut ajouter des conditions pour retourner différentes sous-classes
        return new Photographer(data);
    }
}

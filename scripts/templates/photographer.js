// --- MediaFactory et ses classes associées ---

class MediaImage {
    constructor(data, photographerFolder, index) {
        this.data = data;
        this.photographerFolder = photographerFolder;
        this.index = index;
    }

    createMediaCardDOM() {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.setAttribute('tabindex', '0');
        mediaCard.setAttribute('data-index', this.index);

        mediaCard.innerHTML = `
            <img src="assets/images/${this.photographerFolder}/${this.data.image}" alt="${this.data.title}" data-index="${this.index}">
            <div class="media-info">
                <h3>${this.data.title}</h3>
                <p class="likes">${this.data.likes}<span><i class="fa-regular fa-heart"></i> <i class="fa-solid fa-heart"></i></span></p>
            </div>
        `;
        return mediaCard;
    }
}

class MediaVideo {
    constructor(data, photographerFolder, index) {
        this.data = data;
        this.photographerFolder = photographerFolder;
        this.index = index;
    }

    createMediaCardDOM() {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.setAttribute('tabindex', '0');
        mediaCard.setAttribute('data-index', this.index);

        mediaCard.innerHTML = `
            <video width="350" height="350" data-index="${this.index}">
                <source src="assets/images/${this.photographerFolder}/${this.data.video}" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
            </video>
            <div class="media-info">
                <h3>${this.data.title}</h3>
                <p class="likes">${this.data.likes}<span><i class="fa-regular fa-heart"></i> <i class="fa-solid fa-heart"></i></span></p>
            </div>
        `;
        return mediaCard;
    }
}

class MediaFactory {
    constructor(media, photographerName, index) {
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

class Photographer {
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

    createUserCardDOM() {
        const article = document.createElement('article');
        
        const link = document.createElement('a');
        link.href = `photographer.html?id=${this.id}`;
        link.setAttribute('aria-label', `Profil de ${this.name}`);

        const portraitDiv = document.createElement('div');
        portraitDiv.className = 'portrait';
        
        const img = document.createElement('img');
        img.src = this.picture;
        img.alt = this.name;
        
        const h2 = document.createElement('h2');
        h2.textContent = this.name;

        portraitDiv.appendChild(img);
        link.appendChild(portraitDiv);
        link.appendChild(h2);

        const locationP = document.createElement('p');
        locationP.className = 'location';
        locationP.textContent = `${this.city}, ${this.country}`;
        
        const sloganP = document.createElement('p');
        sloganP.className = 'slogan';
        sloganP.textContent = this.tagline;
        
        const priceSpan = document.createElement('span');
        priceSpan.className = 'price';
        priceSpan.textContent = `${this.price}€/jour`;

        article.appendChild(link);
        article.appendChild(locationP);
        article.appendChild(sloganP);
        article.appendChild(priceSpan);

        return article;
    }

    createProfileHeaderDOM() {
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('photographer-info');
        infoDiv.innerHTML = `
            <h1>${this.name}</h1>
            <p class="location">${this.city}, ${this.country}</p>
            <p class="tagline">${this.tagline}</p>
        `;
        return infoDiv;
    }

    createProfilePictureDOM() {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo-container');
        photoContainer.innerHTML = `<img src="${this.picture}" alt="Portrait de ${this.name}">`;
        return photoContainer;
    }

    createGallery(medias) {
        const gallery = document.createElement('div');
        gallery.classList.add('gallery-grid');
        medias.forEach((mediaItem, index) => {
            const media = new MediaFactory(mediaItem, this.name, index);
            gallery.appendChild(media.createMediaCardDOM());
        });
        return gallery;
    }

    getName() {
        return this.name;
    }
}

export class PhotographerFactory {
    static createPhotographer(data) {
        // Ici on peut ajouter des conditions pour retourner différentes sous-classes
        return new Photographer(data);
    }
}

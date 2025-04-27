

// function MediaFactory(data, photographerName) {
//     const photographerFolder = photographerName.replace(/[\s-]+/g, '');

//     function createMediaCardDOM() {
//         const mediaCard = document.createElement('div');
//         mediaCard.classList.add('media-card');

//         let mediaContent = '';
//         if (data.image) {
//             mediaContent = `<img src="assets/images/${photographerFolder}/${data.image}" alt="${data.title}">`;
//         } else if (data.video) {
//             mediaContent = `
//                 <video controls width="350" height="350">
//                     <source src="assets/images/${photographerFolder}/${data.video}" type="video/mp4">
//                     Votre navigateur ne supporte pas la vidéo.
//                 </video>`;
//         }

//         mediaCard.innerHTML = `
//             ${mediaContent}
//             <div class="media-info">
//                 <h3>${data.title}</h3>
//                 <span class="likes">${data.likes} ❤</span>
//             </div>
//         `;
//         return mediaCard;
//     }

//     return { createMediaCardDOM };
// }

// function PhotographerFactory(data) {
//     const { name, id, city, country, tagline, price, portrait } = data;
//     const picture = `assets/images/photographers_id_photos/${portrait}`;

//     function createUserCardDOM() {
//         const article = document.createElement('article');
        
//         const link = document.createElement('a');
//         link.href = `photographer.html?id=${id}`;
//         link.setAttribute('aria-label', `Profil de ${name}`);

//         const portraitDiv = document.createElement('div');
//         portraitDiv.className = 'portrait';
        
//         const img = document.createElement('img');
//         img.src = picture;
//         img.alt = name;
        
//         const h2 = document.createElement('h2');
//         h2.textContent = name;

//         portraitDiv.appendChild(img);
//         link.appendChild(portraitDiv);
//         link.appendChild(h2);

//         const locationP = document.createElement('p');
//         locationP.className = 'location';
//         locationP.textContent = `${city}, ${country}`;
        
//         const sloganP = document.createElement('p');
//         sloganP.className = 'slogan';
//         sloganP.textContent = tagline;
        
//         const priceSpan = document.createElement('span');
//         priceSpan.className = 'price';
//         priceSpan.textContent = `${price}€/jour`;

//         article.appendChild(link);
//         article.appendChild(locationP);
//         article.appendChild(sloganP);
//         article.appendChild(priceSpan);

//         return article;
//     }

//     function createProfileHeaderDOM() {
//         const infoDiv = document.createElement('div');
//         infoDiv.classList.add('photographer-info');
//         infoDiv.innerHTML = `
//             <h1>${name}</h1>
//             <p class="location">${city}, ${country}</p>
//             <p class="tagline">${tagline}</p>
//         `;
//         return infoDiv;
//     }

//     function createProfilePictureDOM() {
//         const photoContainer = document.createElement('div');
//         photoContainer.classList.add('photo-container');
//         photoContainer.innerHTML = `<img src="${picture}" alt="Portrait de ${name}">`;
//         return photoContainer;
//     }

//     function createGallery(medias) {
//         const gallery = document.createElement('div');
//         gallery.classList.add('gallery-grid');
//         medias.forEach(mediaItem => {
//             const media = MediaFactory(mediaItem, name);
//             gallery.appendChild(media.createMediaCardDOM());
//         });
//         return gallery;
//     }

//     function getName() {
//         return name;
//     }

//     return { 
//         createUserCardDOM, 
//         createProfileHeaderDOM,
//         createProfilePictureDOM,
//         createGallery,
//         getName,
//         id, name 
//     };
// }

function MediaFactory(data, photographerName, index) {
    const photographerFolder = photographerName.replace(/[\s-]+/g, '');

    function createMediaCardDOM() {
        const mediaCard = document.createElement('div');
        mediaCard.classList.add('media-card');
        mediaCard.setAttribute('tabindex', '0');
        mediaCard.setAttribute('data-index', index);

        let mediaContent = '';
        if (data.image) {
            mediaContent = `<img src="assets/images/${photographerFolder}/${data.image}" alt="${data.title}" data-index="${index}">`;
        } else if (data.video) {
            mediaContent = `
                <video controls width="350" height="350" data-index="${index}">
                    <source src="assets/images/${photographerFolder}/${data.video}" type="video/mp4">
                    Votre navigateur ne supporte pas la vidéo.
                </video>`;
        }

        mediaCard.innerHTML = `
            ${mediaContent}
            <div class="media-info">
                <h3>${data.title}</h3>
                <span class="likes">${data.likes} ❤</span>
            </div>
        `;
        return mediaCard;
    }

    return { createMediaCardDOM };
}

function PhotographerFactory(data) {
    const { name, id, city, country, tagline, price, portrait } = data;
    const picture = `assets/images/photographers_id_photos/${portrait}`;

    function createUserCardDOM() {
        const article = document.createElement('article');
        
        const link = document.createElement('a');
        link.href = `photographer.html?id=${id}`;
        link.setAttribute('aria-label', `Profil de ${name}`);

        const portraitDiv = document.createElement('div');
        portraitDiv.className = 'portrait';
        
        const img = document.createElement('img');
        img.src = picture;
        img.alt = name;
        
        const h2 = document.createElement('h2');
        h2.textContent = name;

        portraitDiv.appendChild(img);
        link.appendChild(portraitDiv);
        link.appendChild(h2);

        const locationP = document.createElement('p');
        locationP.className = 'location';
        locationP.textContent = `${city}, ${country}`;
        
        const sloganP = document.createElement('p');
        sloganP.className = 'slogan';
        sloganP.textContent = tagline;
        
        const priceSpan = document.createElement('span');
        priceSpan.className = 'price';
        priceSpan.textContent = `${price}€/jour`;

        article.appendChild(link);
        article.appendChild(locationP);
        article.appendChild(sloganP);
        article.appendChild(priceSpan);

        return article;
    }

    function createProfileHeaderDOM() {
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('photographer-info');
        infoDiv.innerHTML = `
            <h1>${name}</h1>
            <p class="location">${city}, ${country}</p>
            <p class="tagline">${tagline}</p>
        `;
        return infoDiv;
    }

    function createProfilePictureDOM() {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('photo-container');
        photoContainer.innerHTML = `<img src="${picture}" alt="Portrait de ${name}">`;
        return photoContainer;
    }

    function createGallery(medias) {
        const gallery = document.createElement('div');
        gallery.classList.add('gallery-grid');
        medias.forEach((mediaItem, index) => {
            const media = MediaFactory(mediaItem, name, index);
            gallery.appendChild(media.createMediaCardDOM());
        });
        return gallery;
    }

    function getName() {
        return name;
    }

    return { 
        createUserCardDOM, 
        createProfileHeaderDOM,
        createProfilePictureDOM,
        createGallery,
        getName,
        id, name 
    };
}

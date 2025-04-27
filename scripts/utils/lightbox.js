// class Lightbox {
//     constructor() {
//       this.currentIndex = 0;
//       this.mediaItems = [];
//       this.initElements();
//       this.initEvents();
//     }
  
//     initElements() {
//       this.elements = {
//         media: document.getElementById('lightbox-media'),
//         video: document.getElementById('lightbox-video'),
//         title: document.getElementById('lightbox-title'),
//         prev: document.querySelector('.lightbox__prev'),
//         next: document.querySelector('.lightbox__next'),
//         close: document.querySelector('.lightbox__close'),
//         container: document.querySelector('.lightbox__container')
//       };
//     }
  
//     initEvents() {
//       document.addEventListener('click', (e) => {
//         if (e.target.closest('[data-lightbox-trigger]')) {
//           const index = parseInt(e.target.closest('[data-lightbox-trigger]').dataset.index);
//           this.open(index);
//         }
//       });
  
//       this.elements.prev.addEventListener('click', () => this.prev());
//       this.elements.next.addEventListener('click', () => this.next());
//       this.elements.close.addEventListener('click', () => this.close());
//       this.elements.container.addEventListener('click', (e) => e.stopPropagation());
  
//       document.addEventListener('keydown', (e) => {
//         if (this.lightbox.getAttribute('aria-hidden') === 'false') {
//           switch(e.key) {
//             case 'ArrowLeft': this.prev(); break;
//             case 'ArrowRight': this.next(); break;
//             case 'Escape': this.close(); break;
//           }
//         }
//       });
//     }
  
//     open(index) {
//       this.currentIndex = index;
//       this.loadMedia();
//       this.lightbox.hidden = false;
//       this.lightbox.setAttribute('aria-hidden', 'false');
//       this.elements.close.focus();
//       document.body.style.overflow = 'hidden';
//     }
  
//     close() {
//       this.lightbox.hidden = true;
//       this.lightbox.setAttribute('aria-hidden', 'true');
//       document.body.style.overflow = '';
//       this.elements.video.pause();
//     }
  
//     loadMedia() {
//       const media = this.mediaItems[this.currentIndex];
      
//       if (media.type === 'image') {
//         this.elements.media.src = media.src;
//         this.elements.media.alt = media.title;
//         this.elements.media.dataset.active = true;
//         this.elements.video.dataset.active = false;
//       } else {
//         this.elements.video.src = media.src;
//         this.elements.video.dataset.active = true;
//         this.elements.media.dataset.active = false;
//         this.elements.video.play();
//       }
      
//       this.elements.title.textContent = media.title;
//     }
  
//     prev() {
//       this.currentIndex = (this.currentIndex - 1 + this.mediaItems.length) % this.mediaItems.length;
//       this.loadMedia();
//     }
  
//     next() {
//       this.currentIndex = (this.currentIndex + 1) % this.mediaItems.length;
//       this.loadMedia();
//     }
  
//     setMediaItems(mediaArray) {
//       this.mediaItems = mediaArray.map(item => ({
//         src: item.image ? `assets/images/${item.photographerId}/${item.image}` 
//                        : `assets/images/${item.photographerId}/${item.video}`,
//         title: item.title,
//         type: item.image ? 'image' : 'video'
//       }));
//     }
//   }
  
//   // Initialisation globale
//   document.addEventListener('DOMContentLoaded', () => {
//     window.lightbox = new Lightbox();
//   });
  
let lightboxMediaList = [];
let lightboxPhotographerName = "";
let currentLightboxIndex = 0;

function initLightbox(mediaList, photographerName) {
    lightboxMediaList = mediaList;
    lightboxPhotographerName = photographerName;

    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    // Ouvre la lightbox au clic ou au clavier sur un média
    gallery.addEventListener('click', onMediaOpenLightbox);
    gallery.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('media-card')) {
            e.preventDefault();
            onMediaOpenLightbox(e, true);
        }
    });

    // Boutons lightbox
    document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox__prev').addEventListener('click', prevLightboxMedia);
    document.querySelector('.lightbox__next').addEventListener('click', nextLightboxMedia);

    // Navigation clavier dans la lightbox
    document.addEventListener('keydown', lightboxKeyboardHandler);
}

function onMediaOpenLightbox(e, fromKeyboard = false) {
    let target = e.target;
    // Si on clique sur l'image/vidéo ou sur la carte
    if (!target.classList.contains('media-card')) {
        target = target.closest('.media-card');
    }
    if (!target) return;

    const index = parseInt(target.getAttribute('data-index'));
    if (isNaN(index)) return;
    openLightbox(index);
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();

    const lightbox = document.getElementById('lightbox');
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__content').focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.hidden = true;
    document.body.style.overflow = '';
}

function updateLightbox() {
    const media = lightboxMediaList[currentLightboxIndex];
    const content = document.querySelector('.lightbox__content');
    content.innerHTML = '';

    const photographerFolder = lightboxPhotographerName.replace(/[\s-]+/g, '');
    let mediaElement;
    if (media.image) {
        mediaElement = document.createElement('img');
        mediaElement.src = `assets/images/${photographerFolder}/${media.image}`;
        mediaElement.alt = media.title;
    } else if (media.video) {
        mediaElement = document.createElement('video');
        mediaElement.setAttribute('controls', '');
        mediaElement.setAttribute('width', '800');
        mediaElement.setAttribute('height', '600');
        const source = document.createElement('source');
        source.src = `assets/images/${photographerFolder}/${media.video}`;
        source.type = 'video/mp4';
        mediaElement.appendChild(source);
        mediaElement.alt = media.title;
    }
    mediaElement.classList.add('lightbox-media');
    content.appendChild(mediaElement);

    // Ajoute le titre en dessous
    const title = document.createElement('h2');
    title.textContent = media.title;
    title.className = 'lightbox-title';
    content.appendChild(title);
}

function prevLightboxMedia() {
    currentLightboxIndex = (currentLightboxIndex - 1 + lightboxMediaList.length) % lightboxMediaList.length;
    updateLightbox();
}

function nextLightboxMedia() {
    currentLightboxIndex = (currentLightboxIndex + 1) % lightboxMediaList.length;
    updateLightbox();
}

function lightboxKeyboardHandler(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.hidden) return;

    switch (e.key) {
        case 'ArrowLeft':
            prevLightboxMedia();
            break;
        case 'ArrowRight':
            nextLightboxMedia();
            break;
        case 'Escape':
            closeLightbox();
            break;
        default:
            break;
    }
}

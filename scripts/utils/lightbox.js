(function () {
  // Tableau pour stocker les médias de la galerie (images/vidéos)
  let medias = [];
  // Index du média actuellement affiché dans la lightbox
  let currentIndex = 0;

  // Sélection des éléments principaux de la lightbox
  const lightbox = document.getElementById('lightbox');
  const content = lightbox.querySelector('.lightbox__content');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');

  /**
   * Récupère tous les médias de la galerie (images et vidéos)
   * et construit un tableau d'objets médias pour la navigation lightbox
   */
  function getGalleryMedias() {
    const cards = document.querySelectorAll('.media-card');
    medias = Array.from(cards).map(card => {
      const img = card.querySelector('img');
      const video = card.querySelector('video');
      const title = card.querySelector('h3')?.textContent || '';
      if (img) {
        // Si c'est une image
        return {
          type: 'image',
          src: img.src,
          alt: img.alt,
          title
        };
      } else if (video) {
        // Si c'est une vidéo
        const source = video.querySelector('source');
        return {
          type: 'video',
          src: source.src,
          title
        };
      }
      // Ignore les cartes sans média valide
      return null;
    }).filter(Boolean);
  }

  /**
   * Affiche le média (image ou vidéo) à l'index donné dans la lightbox
   * @param {number} index - Index du média à afficher
   */
  function showMedia(index) {
    if (!medias[index]) return;
    currentIndex = index;
    const media = medias[index];
    content.innerHTML = ''; // Vide la lightbox
    let element;
    if (media.type === 'image') {
      // Création et configuration de l'image
      element = document.createElement('img');
      element.src = media.src;
      element.alt = media.alt || media.title || '';
      element.setAttribute('aria-label', media.title || 'Image de la lightbox');
    } else if (media.type === 'video') {
      // Création et configuration de la vidéo
      element = document.createElement('video');
      element.controls = true;
      element.autoplay = true;
      element.setAttribute('aria-label', media.title || 'Vidéo de la lightbox');
      element.innerHTML = `<source src="${media.src}" type="video/mp4">Votre navigateur ne supporte pas la vidéo.`;
    }
    element.tabIndex = 0;
    content.appendChild(element);
  
    // Affiche le titre du média sous l'image/vidéo
    if (media.title) {
      const caption = document.createElement('div');
      caption.className = 'lightbox-title';
      caption.textContent = media.title;
      caption.setAttribute('aria-live', 'polite'); // Annonce le titre au changement
      content.appendChild(caption);
    }
    // Met le focus sur le média pour l'accessibilité
    setTimeout(() => element.focus(), 50);
  }
  
  /**
   * Ouvre la lightbox à l'index donné
   * @param {number} index - Index du média à afficher
   */
  function openLightbox(index) {
    getGalleryMedias(); // Met à jour la liste des médias
    showMedia(index);   // Affiche le média sélectionné
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden'; // Désactive le scroll en arrière-plan
    lightbox.setAttribute('aria-hidden', 'false');
    btnClose.focus(); // Met le focus sur le bouton de fermeture
    document.addEventListener('keydown', handleKeydown); // Active la gestion clavier
    // Cache le contenu principal aux lecteurs d'écran
    document.getElementById('main').setAttribute('aria-hidden', 'true');
  }
  
  /**
   * Ferme la lightbox et restaure l'état initial
   */
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lightbox.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKeydown);
    // Réaffiche le contenu principal aux lecteurs d'écran
    document.getElementById('main').setAttribute('aria-hidden', 'false');
  }
  
  /**
   * Affiche le média suivant dans la lightbox
   */
  function nextMedia() {
    showMedia((currentIndex + 1) % medias.length);
  }

  /**
   * Affiche le média précédent dans la lightbox
   */
  function prevMedia() {
    showMedia((currentIndex - 1 + medias.length) % medias.length);
  }

  /**
   * Gestion du clavier dans la lightbox :
   * - Flèches gauche/droite pour navigation
   * - Escape pour fermer
   * - Tab pour focus trap
   * @param {KeyboardEvent} e
   */
  function handleKeydown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextMedia();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevMedia();
        break;
      case 'Escape':
        e.preventDefault();
        closeLightbox();
        break;
      case 'Tab':
        // Piège le focus dans la lightbox
        trapFocus(e);
        break;
    }
  }

  /**
   * Piège le focus dans la lightbox pour l'accessibilité
   * @param {KeyboardEvent} e
   */
  function trapFocus(e) {
    const focusables = lightbox.querySelectorAll('button, [tabindex="0"]');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      // Shift+Tab sur le premier : boucle sur le dernier
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      // Tab sur le dernier : boucle sur le premier
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // === Listeners d'interaction ===

  // Bouton de fermeture
  btnClose.addEventListener('click', closeLightbox);
  // Bouton suivant
  btnNext.addEventListener('click', nextMedia);
  // Bouton précédent
  btnPrev.addEventListener('click', prevMedia);

  // Ouvre la lightbox au clic sur une media-card (image ou vidéo)
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.media-card');
    if (!card) return;
    const idx = parseInt(card.getAttribute('data-index'), 10);
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      openLightbox(idx);
    }
  });

  // Ouvre la lightbox au clavier (Entrée ou Espace sur une media-card)
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.classList.contains('media-card')) {
      const idx = parseInt(document.activeElement.getAttribute('data-index'), 10);
      openLightbox(idx);
      e.preventDefault();
    }
  });

  // Ferme la lightbox si on clique en dehors du contenu (sur le fond)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
})();

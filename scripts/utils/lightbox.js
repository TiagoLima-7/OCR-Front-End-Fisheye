(function () {
    let medias = [];
    let currentIndex = 0;
  
    const lightbox = document.getElementById('lightbox');
    const content = lightbox.querySelector('.lightbox__content');
    const btnClose = lightbox.querySelector('.lightbox__close');
    const btnPrev = lightbox.querySelector('.lightbox__prev');
    const btnNext = lightbox.querySelector('.lightbox__next');
  
    // Récupère toutes les media-cards au chargement
    function getGalleryMedias() {
      const cards = document.querySelectorAll('.media-card');
      medias = Array.from(cards).map(card => {
        const img = card.querySelector('img');
        const video = card.querySelector('video');
        const title = card.querySelector('h3')?.textContent || '';
        if (img) {
          return {
            type: 'image',
            src: img.src,
            alt: img.alt,
            title
          };
        } else if (video) {
          const source = video.querySelector('source');
          return {
            type: 'video',
            src: source.src,
            title
          };
        }
        return null;
      }).filter(Boolean);
    }
  
    // Affiche le média courant dans la lightbox
    function showMedia(index) {
      if (!medias[index]) return;
      currentIndex = index;
      const media = medias[index];
      content.innerHTML = '';
      let element;
      if (media.type === 'image') {
        element = document.createElement('img');
        element.src = media.src;
        element.alt = media.alt || media.title || '';
      } else if (media.type === 'video') {
        element = document.createElement('video');
        element.controls = true;
        element.autoplay = true;
        element.innerHTML = `<source src="${media.src}" type="video/mp4">Votre navigateur ne supporte pas la vidéo.`;
      }
      element.tabIndex = 0;
      content.appendChild(element);
  
      // Affiche le titre
      if (media.title) {
        const caption = document.createElement('div');
        caption.className = 'lightbox-title';
        caption.textContent = media.title;
        content.appendChild(caption);
      }
      // Focus pour accessibilité
      setTimeout(() => element.focus(), 50);
    }
  
    function openLightbox(index) {
      getGalleryMedias();
      showMedia(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.setAttribute('aria-hidden', 'false');
      btnClose.focus();
      // Piège le focus dans la lightbox
      document.addEventListener('keydown', handleKeydown);
    }
  
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      lightbox.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', handleKeydown);
    }
  
    function nextMedia() {
      showMedia((currentIndex + 1) % medias.length);
    }
  
    function prevMedia() {
      showMedia((currentIndex - 1 + medias.length) % medias.length);
    }
  
    // Gestion clavier (flèches, esc, tab)
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
  
    // Piège le focus dans la lightbox
    function trapFocus(e) {
      const focusables = lightbox.querySelectorAll('button, [tabindex="0"]');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
  
    // Listeners boutons
    btnClose.addEventListener('click', closeLightbox);
    btnNext.addEventListener('click', nextMedia);
    btnPrev.addEventListener('click', prevMedia);
  
    // Ouvre la lightbox au clic sur une media-card
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
  
    // Ferme la lightbox si on clique en dehors du contenu
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  })();
  
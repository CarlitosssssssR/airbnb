document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.gallery-track');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevButton = document.querySelector('.gallery-nav.prev');
    const nextButton = document.querySelector('.gallery-nav.next');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lbImage');
    const lbCaption = document.getElementById('lbCaption');
    const closeButton = document.querySelector('.lb-close');
    const lbPrev = document.querySelector('.lb-prev');
    const lbNext = document.querySelector('.lb-next');
    
    if (!track || !slides.length) return;
    
    let currentPosition = 0;
    let currentLightboxIndex = 0;
    const slideWidth = 320; // 300px width + 20px gap
    const slidesToShow = Math.floor(track.parentElement.clientWidth / slideWidth);
    const maxPosition = -(slides.length - slidesToShow) * slideWidth;

    function updateSlidePosition() {
        track.style.transform = `translateX(${currentPosition}px)`;
    }

    function handleNext() {
        if (currentPosition > maxPosition) {
            currentPosition -= slideWidth;
            updateSlidePosition();
        }
    }

    function handlePrev() {
        if (currentPosition < 0) {
            currentPosition += slideWidth;
            updateSlidePosition();
        }
    }

    // Event Listeners para navegación de galería
    if (nextButton) nextButton.addEventListener('click', handleNext);
    if (prevButton) prevButton.addEventListener('click', handlePrev);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    });

    // Prevent drag on images
    slides.forEach(slide => {
        slide.addEventListener('dragstart', e => e.preventDefault());
    });

    // Click to enlarge - Lightbox functionality
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            const img = slide.querySelector('img');
            currentLightboxIndex = index;
            
            if (lightboxImg && lightbox) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                if (lbCaption) lbCaption.textContent = img.alt;
                lightbox.setAttribute('aria-hidden', 'false');
                lightbox.style.display = 'flex';
            }
        });
    });

    // Lightbox navigation functions
    function showLightboxImage(index) {
        if (index >= 0 && index < slides.length) {
            currentLightboxIndex = index;
            const img = slides[index].querySelector('img');
            if (lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
            if (lbCaption) lbCaption.textContent = img.alt;
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.style.display = 'none';
        }
    }

    // Close button
    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }

    // Previous image in lightbox
    if (lbPrev) {
        lbPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : slides.length - 1;
            showLightboxImage(newIndex);
        });
    }

    // Next image in lightbox
    if (lbNext) {
        lbNext.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = currentLightboxIndex < slides.length - 1 ? currentLightboxIndex + 1 : 0;
            showLightboxImage(newIndex);
        });
    }

    // Click outside to close
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation - SOLO para el lightbox cuando está abierto
    document.addEventListener('keydown', e => {
        const isLightboxOpen = lightbox && lightbox.getAttribute('aria-hidden') === 'false';
        
        if (isLightboxOpen) {
            // Navegación en el lightbox
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                const newIndex = currentLightboxIndex < slides.length - 1 ? currentLightboxIndex + 1 : 0;
                showLightboxImage(newIndex);
            } else if (e.key === 'ArrowLeft') {
                const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : slides.length - 1;
                showLightboxImage(newIndex);
            }
        }
    });
});
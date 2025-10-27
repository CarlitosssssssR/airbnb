document.addEventListener('DOMContentLoaded', function() {
    // Carrusel Principal (3D)
    const mainCarousel = document.getElementById('mainCarousel');
    if (!mainCarousel) return;
    
    const mainSlides = Array.from(mainCarousel.getElementsByClassName('slide'));
    if (mainSlides.length === 0) return;
    
    let isDragging = false;
    let startPos = 0;
    let currentIndex = 0;
    const totalSlides = mainSlides.length;

    // Variables para el seguimiento del arrastre
    let initialX = 0;
    let currentX = 0;

    function updateMainCarousel() {
        mainSlides.forEach((slide, index) => {
            slide.classList.remove('slide-center', 'slide-left', 'slide-right', 'slide-hidden');
            const position = (index - currentIndex + totalSlides) % totalSlides;
            
            if (position === 0) {
                slide.classList.add('slide-center');
            } else if (position === 1) {
                slide.classList.add('slide-right');
            } else if (position === totalSlides - 1) {
                slide.classList.add('slide-left');
            } else {
                slide.classList.add('slide-hidden');
            }
        });
    }

    // Funciones para el manejo táctil y mouse
    function handleStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX;
        } else {
            initialX = e.clientX;
            mainCarousel.style.cursor = 'grabbing';
        }
        isDragging = true;
        startPos = initialX;
    }

    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startPos;

        // Solo actualizamos si el movimiento es significativo
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToPrevSlide();
            } else {
                goToNextSlide();
            }
            isDragging = false;
        }
    }

    function handleEnd() {
        isDragging = false;
        mainCarousel.style.cursor = 'grab';
    }

    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateMainCarousel();
    }

    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateMainCarousel();
    }

    // Event Listeners para el carrusel principal SOLO
    mainCarousel.addEventListener('mousedown', handleStart);
    mainCarousel.addEventListener('touchstart', handleStart, { passive: true });
    
    mainCarousel.addEventListener('mousemove', handleMove);
    mainCarousel.addEventListener('touchmove', handleMove, { passive: false });
    
    mainCarousel.addEventListener('mouseup', handleEnd);
    mainCarousel.addEventListener('touchend', handleEnd);
    
    // Prevenir el menú contextual en móviles
    mainCarousel.addEventListener('contextmenu', e => e.preventDefault());

    // Auto-rotación cada 10 segundos si no hay interacción
    let autoRotateInterval = setInterval(() => {
        if (!isDragging) {
            goToNextSlide();
        }
    }, 10000);

    // Cambio automático inicial
    updateMainCarousel();

    // Pausar auto-rotación cuando el lightbox está abierto
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const observer = new MutationObserver(() => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                clearInterval(autoRotateInterval);
            } else {
                autoRotateInterval = setInterval(() => {
                    if (!isDragging) {
                        goToNextSlide();
                    }
                }, 10000);
            }
        });
        
        observer.observe(lightbox, { attributes: true, attributeFilter: ['aria-hidden'] });
    }
});
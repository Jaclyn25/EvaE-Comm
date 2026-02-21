class ImageSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slides = options.slides || this.getDefaultSlides();
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = options.autoPlayDelay || 5000;
        this.isPlaying = options.autoPlay !== false;

        this.init();
    }

    getDefaultSlides() {
    return [
        {
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&h=700&auto=format&fit=crop',
            title: 'Ultimate Summer Sale',
            description: 'Up to 50% OFF on the latest fashion trends. Redefine your style this season.'
        },
        {
            image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1600&h=700&auto=format&fit=crop',
            title: 'Next-Gen Technology',
            description: 'Explore our premium selection of smartphones and gadgets. Pure performance in your hands.'
        },
        {
            image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&h=700&auto=format&fit=crop',
            title: 'Beauty & Radiance',
            description: 'Discover premium makeup collections designed to make you shine, every single day.'
        },
        {
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&h=700&auto=format&fit=crop',
            title: 'Exclusive New Arrivals',
            description: 'Be the first to own our latest drops. Quality meet elegance in every piece.'
        },
        {
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&h=700&auto=format&fit=crop',
            title: 'Limited Time Offers',
            description: 'Flash deals are live! Grab your favorites before they are gone forever.'
        }
    ];
}

    init() {
        this.createSliderStructure();
        this.renderSlides();
        this.bindEvents();
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }

    createSliderStructure() {
        const wrapper = document.createElement('div');
        wrapper.className = 'slider-wrapper';
        wrapper.id = 'sliderWrapper';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn slider-btn-prev';
        prevBtn.id = 'prevBtn';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        `;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn slider-btn-next';
        nextBtn.id = 'nextBtn';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        `;

        const pagination = document.createElement('div');
        pagination.className = 'slider-pagination';
        pagination.id = 'sliderPagination';

        this.container.appendChild(wrapper);
        this.container.appendChild(prevBtn);
        this.container.appendChild(nextBtn);
        this.container.appendChild(pagination);
    }

    renderSlides() {
        const wrapper = this.container.querySelector('#sliderWrapper');
        const pagination = this.container.querySelector('#sliderPagination');

        wrapper.innerHTML = this.slides.map((slide, index) => `
            <div class="slider-slide ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
                <img src="${slide.image}" alt="${slide.title}" loading="lazy">
                <div class="slider-content">
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                </div>
            </div>
        `).join('');

        pagination.innerHTML = this.slides.map((_, index) => `
            <button class="pagination-dot ${index === 0 ? 'active' : ''}" 
                    data-slide-index="${index}" 
                    aria-label="Go to slide ${index + 1}">
            </button>
        `).join('');

        this.updateSliderPosition();
    }

    goToSlide(index) {
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }

        this.currentIndex = index;
        this.updateSliderPosition();
        this.updatePagination();
        this.resetAutoPlay();
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    updateSliderPosition() {
        const slides = this.container.querySelectorAll('.slider-slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentIndex) {
                slide.classList.add('active');
            }
        });

        const wrapper = this.container.querySelector('#sliderWrapper');
        wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    updatePagination() {
        const dots = this.container.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }

    bindEvents() {
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        const pagination = this.container.querySelector('#sliderPagination');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        if (pagination) {
            pagination.addEventListener('click', (e) => {
                const dot = e.target.closest('.pagination-dot');
                if (dot) {
                    const index = parseInt(dot.dataset.slideIndex);
                    this.goToSlide(index);
                }
            });
        }

        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.container.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.startAutoPlay();
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.contains(document.activeElement) || 
                document.activeElement === document.body) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    destroy() {
        this.stopAutoPlay();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default ImageSlider;

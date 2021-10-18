window.addEventListener("load", function() {
    greetings();
    heroSlider();
    loadAnimate();
});

const greetings = function() {
    console.log("hello");
};

// hero-slider
const heroSlider = function () {
    class HeroSlider {
        constructor(el) {
            this._el = el;
            this._objects = this._el.querySelector(".hero-slider__objects");
            this._labels = this._el.querySelector(".hero-slider__labels");
            this._videos = this._el.querySelectorAll("video");
            this._objectsOptions = {
                loop: true,
                speed: 500,
                init: false,
                lazy: {
                    loadPrevNext: true,
                    loadOnTransitionStart: true,
                    loadPrevNextAmount: 5
                },
                navigation: {
                    // nextEl: ".swiper-button-next",
                    // prevEl: ".swiper-button-prev"
                    nextEl: ".hero-slider__right",
                    prevEl: ".hero-slider__left"

                },
                pagination: {
                    el: ".swiper-pagination",
                    type: "bullets",
                    clickable: true
                },
                breakpoints: {
                    651: {
                        speed: 1300
                    }
                },
            };
            this._labelsOptions = {
                touchRatio: 0.2,
                slideToClickedSlide: true,
                loop: true,
                speed: 500,
                breakpoints: {
                    651: {
                        speed: 1300
                    }
                }
            };
            this._objectsSwiper = null;
            this._labelsSwiper = null;

            this._slides = this._el.querySelectorAll(".hero-slider__object:not(.swiper-slide-duplicate)").length; // исходное число слайдов

            this._slideTimeout = null;
            this._isAudioMuted = true;
            this._isAudioInProcess = false,
            this._isAudioLoaded = false;
        }
        init() {
            this._deleteMediaOnSmallSizes();

            this._objectsSwiper = new Swiper(this._objects, this._objectsOptions); // eslint-disable-line
            this._labelsSwiper = new Swiper(this._labels, this._labelsOptions); // eslint-disable-line

            this._objectsSwiper.controller.control = this._labelsSwiper;
            this._labelsSwiper.controller.control = this._objectsSwiper;

            this._objectsSwiper.on("init", () => {
                this._videos = this._el.querySelectorAll("video");
                this._loadVideo("init");
            });

            this._objectsSwiper.init();

            this._objectsSwiper.on("slideChangeTransitionStart", () => {
                this._loadVideo("start");
            });
            this._objectsSwiper.on("slideChangeTransitionEnd", () => {
                this._loadVideo("end");
            });
        }

        _loadVideo(type) {
            const activeSlides = this._el.querySelectorAll(`.hero-slider__object[data-swiper-slide-index="${this._objectsSwiper.realIndex}"]`);

            if (type === "init" && this._videos.length > 0) {
                activeSlides.forEach(slide => {
                    const video = slide.querySelector("video");
                    video.src = video.dataset.videoSrc;
                    video.autoplay = true;
                });
            } else if (type === "start" && this._videos.length > 0) {
                activeSlides.forEach(slide => {
                    const video = slide.querySelector("video");
                    video.src = video.dataset.videoSrc;
                    video.autoplay = false;
                });
            } else if (type === "end" && this._videos.length > 0) {
                activeSlides.forEach(slide => {
                    const video = slide.querySelector("video");
                    video.autoplay = true;
                    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
                    if (!isPlaying) {
                        video.play();
                    }
                });
            }
            activeSlides.forEach(slide => {
                this._setVideoAutoPlay(slide);
            });
        }
        _setVideoAutoPlay(slide) {
            const video = slide.querySelector("video");
            const timeStart = new Date();
            const _this = this;
            const bullet = this._el.querySelector(".swiper-pagination-bullet-active");
            let timeLoad = null;
            let defaultTime = 9000;
            let timeDuration = null;

            if (video) {
                video.oncanplay = () => {
                    defaultTime = video.duration * 1000;
                    timeLoad = new Date() - timeStart;

                    if (timeLoad < 9000) {
                        clearTimeout(_this._slideTimeout);
                        timeDuration = defaultTime - timeLoad;
                        bullet.style.animationDuration = `${timeDuration}ms`;
                        _this._slideTimeout = setTimeout(function () {
                            _this._objectsSwiper.slideNext();
                        }, timeDuration);
                        video.oncanplay = null;
                    }
                };
            } else {
                // тут обработаем вариант для мобильных утройств, когда видео нет в дом
                clearTimeout(_this._slideTimeout);

                bullet.style.animationDuration = defaultTime + "ms";

                _this._slideTimeout = setTimeout(function () {
                    _this._objectsSwiper.slideNext();
                    if (video) {
                        video.oncanplay = null;
                    }
                }, defaultTime);
            }
        }
        // удаление видео из дом еще на этапе инициализации на маленьких экранах
        _deleteMediaOnSmallSizes() {
            if (window.innerWidth <= 768 || (window.innerWidth <= 950 && window.innerHeight <= 450)) {
                if (this._videos) {
                    this._videos.forEach(video => {
                        video.remove();
                    });
                }
            }
        }
    }

    const heroSliderEl = document.querySelector(".hero-slider");
    if (!heroSliderEl) {
        return false;
    }
    const heroSliderComp = new HeroSlider(heroSliderEl);
    heroSliderComp.init();
};

// tripleslider

// подгрузка и анимирование
const loadAnimate = function () {
    const lazyImages = document.querySelectorAll("[data-lazy-src]");
    const animFooter = document.querySelector(".footer");
    const animFooterElems = animFooter.querySelectorAll("[data-scroll-anim]");

    const options = {
        rootMargin: "50px",
        threshold: 0,
    };
    const footerOptions = {
        threshold: 0.25,
    };

    lazyImages.forEach(item => {
        const callback = function (entries) {
            entries.forEach(entry => {
                const {
                    isIntersecting
                } = entry;
                if (isIntersecting) {
                    item.src = item.dataset.lazySrc;
                    item.closest(".tiles__tile").classList.add("is-loaded");
                }
            });
        };
        const lazyObserver = new IntersectionObserver(callback, options);
        lazyObserver.observe(item);
    });

    const footerCallback = function (entries) {
        entries.forEach(entry => {
            const {
                isIntersecting
            } = entry;
            if (isIntersecting) {
                let i = 0;
                let interval = setInterval(function () {
                    if (i < animFooterElems.length) {
                        animFooterElems[i].classList.add("is-animed");
                        i++;
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
            }
        });
    };

    const animObserver = new IntersectionObserver(footerCallback, footerOptions);
    animObserver.observe(animFooter);
};
window.addEventListener("load", function() {
    header();
    heroSlider();
    loadAnimate();
    filterRangeBlocks();
    tripleSliderBlock();
});

class Header {
    constructor(headerEl) {
        this._header = headerEl;
        this._menu = this._header.querySelector(".header__menu");
        this._search = this._header.querySelector(".header__search");
        this._searchInput = this._search.querySelector(".header__search-field");
        this._searchForm = this._search.querySelector(".header__search-form");
        this._submenu = this._header.querySelector(".header__submenu");
        this._burger = this._header.querySelector(".header__mobile-burger");
        this._mobmenu = this._header.querySelector(".header__mobile-menu");
        this._mobItems = this._mobmenu.querySelectorAll(".mobile-menu__item");

        this._animateDelay = 50;

        this._oldScroll = 0;
        this._isBurgerOpen = false;
        this._isSearchOpen = false;
        this._isSubmenuOpen = false;

        this._handleScrolling = this._handleScrolling.bind(this);
        this._handleBurger = this._handleBurger.bind(this);
        this._handleSearchBtn = this._handleSearchBtn.bind(this);
        this._handleSearchClose = this._handleSearchClose.bind(this);
        this._handleMobileSearchOpen = this._handleMobileSearchOpen.bind(this);
        this._handleMobileSearchClose = this._handleMobileSearchClose.bind(this);
        this._handleSubmenu = this._handleSubmenu.bind(this);
    }

    init() {
        this._setHandlerScrolling();
        this._setHandlerBurger();
        this._setHandlerSearch();
        this._setHandlerSubmenu();
    }
    // scrolling
    _setHandlerScrolling() {
        document.addEventListener("scroll", this._handleScrolling);
    }

    _handleScrolling() {
        const headerHeight = this._header.getBoundingClientRect().height;
        let scrolled = document.documentElement.scrollTop;
        if (this._oldScroll < scrolled) {
            if (scrolled > headerHeight) {
                this._setClassIsHidden();
                this._setClassIsScrolled();
            }
        } else {
            if (scrolled > headerHeight) {
                this._delClassIsHidden();
                this._setClassIsScrolled();
            }
        }
        if (scrolled === 0) {
            this._delClassIsScrolled();
        }
        this._oldScroll = scrolled;
    }
    // - burger handling
    _setHandlerBurger() {
        this._burger.addEventListener("click", this._handleBurger);
    }

    _handleBurger(e) {
        e.preventDefault();
        if (this._isBurgerOpen) {
            this.closeBurger();
        } else {
            this.openBurger();
        }
    }

    openBurger() {
        this._setClassIsBurger();
        this._isBurgerOpen = true;
        this._bodyFreeze();
        this._mobItemsFadeIn();
    }

    closeBurger() {
        this._mobItemsFadeOut(() => {
            this._delClassIsBurger();
        });
        // this._delClassIsBurger();
        this._isBurgerOpen = false;
        this._bodyUnfreeze();
    }
    _mobItemsFadeIn() {
        const _this = this;
        let i = 0;
        const interval = setInterval(function () {
            if (i < _this._mobItems.length) {
                _this._mobItems[i].classList.add("is-animed");
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
    }

    _mobItemsFadeOut(callback) {
        const _this = this;
        let i = _this._mobItems.length - 1;
        const interval = setInterval(function () {
            if (i >= 0) {
                _this._mobItems[i].classList.remove("is-animed");
                i--;
            } else {
                if (callback) {
                    callback();
                }
                clearInterval(interval);
            }
        }, 50);
    }
    // - search handling
    _setHandlerSearch() {
        const trigger = this._header.querySelector(".header__search-btn");
        const clear = this._search.querySelector(".header__search-clear");
        const mobileTrigger = this._mobmenu.querySelector(".mobile-menu__search");
        const mobileClose = this._header.querySelector(".header__mobile-search-back");

        trigger.addEventListener("click", this._handleSearchBtn);
        clear.addEventListener("click", this._handleSearchClose);
        mobileTrigger.addEventListener("click", this._handleMobileSearchOpen);
        mobileClose.addEventListener("click", this._handleMobileSearchClose);
    }
    _handleSearchBtn(e) {
        e.preventDefault();
        if (!this._isSearchOpen) {
            this._setClassIsSearch();
            this._isSearchOpen = true;
            this._bodyFreeze();
        } else {
            this._searchForm.submit();
        }
    }
    _handleSearchClose(e) {
        e.preventDefault();
        if (this._isSearchOpen) {
            this._searchInput.value = "";
            this._delClassIsSearch();
            this._isSearchOpen = false;
            this._bodyUnfreeze();
        } else {
            return;
        }
    }
    _handleMobileSearchOpen(e) {
        e.preventDefault();
        if (!this._isSearchOpen) {
            this._setClassIsSearch();
            this._isSearchOpen = true;
            this._bodyFreeze();
        }
    }
    _handleMobileSearchClose(e) {
        e.preventDefault();
        if (this._isSearchOpen) {
            this._searchInput.value = "";
            this._delClassIsSearch();
            this._isSearchOpen = false;
            this._bodyUnfreeze();
        } else {
            return;
        }
    }

    _setHandlerSubmenu() {
        if (!this._submenu) {
            return;
        }
        this._submenu.addEventListener("click", this._handleSubmenu);
    }
    _handleSubmenu(e) {
        if (window.innerWidth <= 1024) {
            if (e.target.classList.contains("submenu__link")) {
                return;
            }
            e.preventDefault();
            if (!this._isSubmenuOpen) {
                this._submenu.classList.add("is-active");
                this._isSubmenuOpen = true;
                this._submenu.style.height = this._submenu.scrollHeight + 15 + "px";
            } else {
                this._submenu.classList.remove("is-active");
                this._submenu.style.height = "";
                this._isSubmenuOpen = false;
            }
        }
    }

    _setClassIsBurger() {
        this._header.classList.add("is-burger");
    }
    _delClassIsBurger() {
        this._header.classList.remove("is-burger");
    }
    _setClassIsSearch() {
        this._header.classList.add("is-search");
    }
    _delClassIsSearch() {
        this._header.classList.remove("is-search");
    }
    _setClassIsHidden() {
        this._header.classList.add("is-hidden");
    }
    _delClassIsHidden() {
        this._header.classList.remove("is-hidden");
    }
    _setClassIsScrolled() {
        this._header.classList.add("is-scrolled");
    }
    _delClassIsScrolled() {
        this._header.classList.remove("is-scrolled");
    }

    // TODO - safari compatible
    _bodyFreeze() {
        document.body.classList.add("is-unscrolled");
    }
    _bodyUnfreeze() {
        document.body.classList.remove("is-unscrolled");
    }
}

const header = function () {
    const headerEl = document.querySelector(".header");
    const header = new Header(headerEl);
    header.init();
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
const tripleSliderBlock = function() {
    const blocks = document.querySelectorAll(".tripleslider-block");
    if(blocks.length == 0 || !blocks) {
        return false;
    }
    blocks.forEach(block => {
        const sliderEl = block.querySelector(".tripleslider");
        const prevArrow = block.querySelector(".tripleslider-block__prev");
        const nextArrow = block.querySelector(".tripleslider-block__next");

        const swiper = new Swiper(sliderEl, {
            slidesPerView: 3,
            navigation: {
                nextEl: nextArrow,
                prevEl: prevArrow,
            },
        });

        if(window.innerWidth > 768) {
            if(swiper.slides.length <= 3) {
                prevArrow.style.opacity = "0";
                nextArrow.style.opacity = "0";
            }
        }
    });

};

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

const filterRangeBlocks = function() {
    const block = document.querySelectorAll(".filters-range");
    if(!block || block.length === 0) {
        return false
    };
    const slider = document.querySelector("#filter-area");
    noUiSlider.create(slider, {
        start: [20, 80],
        connect: true,
        range: {
            'min': 0,
            'max': 100,
        }
    });
};
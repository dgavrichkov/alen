// preloader
// -- show preloader (start of async operations)
// -- -- render preloader node
// -- -- animate preloader node
// -- hide preloader (end of async operations)
// -- -- animate preloader node
// -- -- destroy preloader node

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
        if(this._oldScroll < scrolled) {
            if(scrolled > headerHeight) {
                this._setClassIsHidden();
                this._setClassIsScrolled();
            }
        } else {
            if(scrolled > headerHeight) {
                this._delClassIsHidden();
                this._setClassIsScrolled();
            }
        }
        if(scrolled === 0) {
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
        if(this._isBurgerOpen) {
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
        const interval = setInterval(function() {
            if(i < _this._mobItems.length) {
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
        const interval = setInterval(function() {
            if(i >= 0) {
                _this._mobItems[i].classList.remove("is-animed");
                i--;
            } else {
                if(callback) {
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
        if(!this._isSearchOpen) {
            this._setClassIsSearch();
            this._isSearchOpen = true;
            this._bodyFreeze();
        } else {
            this._searchForm.submit();
        }
    }
    _handleSearchClose(e) {
        e.preventDefault();
        if(this._isSearchOpen) {
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
        if(!this._isSearchOpen) {
            this._setClassIsSearch();
            this._isSearchOpen = true;
            this._bodyFreeze();
        }
    }
    _handleMobileSearchClose(e) {
        e.preventDefault();
        if(this._isSearchOpen) {
            this._searchInput.value = "";
            this._delClassIsSearch();
            this._isSearchOpen = false;
            this._bodyUnfreeze();
        } else {
            return;
        }
    }

    _setHandlerSubmenu() {
        if(!this._submenu) {
            return;
        }
        this._submenu.addEventListener("click", this._handleSubmenu);
    }
    _handleSubmenu(e) {
        if(window.innerWidth <= 1024) {
            if(e.target.classList.contains("submenu__link")) {
                return;
            }
            e.preventDefault();
            if(!this._isSubmenuOpen) {
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

    _setClassIsBurger () {
        this._header.classList.add("is-burger");
    }
    _delClassIsBurger () {
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

const heroSlider = function() {
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

            if(type === "init" && this._videos.length > 0) {
                activeSlides.forEach(slide => {
                    const video = slide.querySelector("video");
                    video.src = video.dataset.videoSrc;
                    video.autoplay = true;
                });
            } else if(type === "start" && this._videos.length > 0) {
                activeSlides.forEach(slide => {
                    const video = slide.querySelector("video");
                    video.src = video.dataset.videoSrc;
                    video.autoplay = false;
                });
            } else if(type === "end" && this._videos.length > 0) {
                activeSlides.forEach(slide => {
                    const video = slide.querySelector("video");
                    video.autoplay = true;
                    const isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2;
                    if(!isPlaying) {
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
    
            if(video) {
                video.oncanplay = () => {
                    defaultTime = video.duration * 1000;
                    timeLoad = new Date() - timeStart;

                    if(timeLoad < 9000) {
                        clearTimeout(_this._slideTimeout);
                        timeDuration = defaultTime - timeLoad;
                        bullet.style.animationDuration = `${timeDuration}ms`;
                        _this._slideTimeout = setTimeout(function() {
                            _this._objectsSwiper.slideNext();
                        }, timeDuration);
                        video.oncanplay = null;
                    }
                };
            } else {
                // тут обработаем вариант для мобильных утройств, когда видео нет в дом
                clearTimeout(_this._slideTimeout);
                
                bullet.style.animationDuration = defaultTime + "ms";
                
                _this._slideTimeout = setTimeout(function() {
                    _this._objectsSwiper.slideNext();
                    if(video) {
                        video.oncanplay = null;
                    }
                }, defaultTime);
            }
        }
        // удаление видео из дом еще на этапе инициализации на маленьких экранах
        _deleteMediaOnSmallSizes() {
            if(window.innerWidth <= 768 || (window.innerWidth <= 950 && window.innerHeight <= 450)) {
                if(this._videos) {
                    this._videos.forEach(video => {
                        video.remove();
                    });
                }
            }
        }
    }

    class Sound {
        constructor(el) {
            this._el = el;
            this._audio = this._el.querySelector("audio");
            this._audioTrigger = this._el.querySelector(".hero-slider__sound");

            this._isUnmute = false;
            this._isLoaded = false;
            this._isPlaying = false;

            this._handleSoundClick = this._handleSoundClick.bind(this);
        }
        init() {
            this._deleteMediaOnSmallSizes();
            this._setAudioFile();
            this._setSoundClickHandler();
            
        }

        _deleteMediaOnSmallSizes() {
            if(window.innerWidth <= 768 || (window.innerWidth <= 950 && window.innerHeight <= 450)) {
                this._audio.remove();
                this._audio = "rejected";
            }
        }

        _setAudioFile() {
            if(this._audio === "rejected") {
                return;
            }
            this._audio.setAttribute("src", this._audio.dataset.src);
        }
        _setSoundClickHandler() {
            this._audioTrigger.addEventListener("click", this._handleSoundClick);
        }
        // обработчик включения-выключения звука
        _handleSoundClick() {
            if(!this._isUnmute) {
                this._audioTrigger.innerText = this._audioTrigger.dataset.wordOn;
                this._audioTrigger.classList.add("is-active");
                this._soundStart();
            } else {
                this._audioTrigger.innerText = this._audioTrigger.dataset.wordOff;
                this._audioTrigger.classList.remove("is-active");
                this._soundStop();
            }
        }
        _soundStart() {
            this._isUnmute = true;
            this._isPlaying = true;
            this._audio.volume = 0;
            const _this = this;
            const play = () => {
                this._audio.play();
                this._isLoaded = true;
                const interval = setInterval(function() {
                    _this._audio.volume += 0.01;
                    if(_this._audio.volume >= 0.9) {
                        clearInterval(interval);
                        _this._audio.volume = 1;
                        _this._isPlaying = false;
                    }
                }, 10);
            };

            if(!this._isLoaded) {
                this._audio.load();
                this._audio.oncanplay = play;
            } else {
                play();
            }
        }
        _soundStop() {
            this._isUnmute = false;
            this._isPlaying = true;
            const _this = this;
            const interval = setInterval(function() {
                _this._audio.volume -= 0.01;
                if(_this._audio.volume <= 0.1) {
                    clearInterval(interval);
                    _this._audio.pause();
                    _this._audio.volume = 0;
                    _this._isPlaying = false;
                }
            }, 10);
        }
    }

    const heroSliderEl = document.querySelector(".hero-slider");
    if(!heroSliderEl) {
        return false;
    }
    const heroSliderComp = new HeroSlider(heroSliderEl);
    const heroSoundComp = new Sound(heroSliderEl);
    heroSliderComp.init();
    heroSoundComp.init();
};

// gallery
const gallery = function() {
    // preview load anim
    const preview = document.querySelector(".gallery-preview");
    if(preview) {
        const options = {
            threshold: 0.75,
        }
        const callback = function(entries) {
            entries.forEach(entry => {
                const {isIntersecting} = entry;
                if(isIntersecting) {
                    preview.classList.add("is-animed");
                } 
            })
        }
        const previewObserver = new IntersectionObserver(callback, options);
        
        previewObserver.observe(preview);
    }
    
    //-- gallery call

};

// popup
class Popup {
    constructor() {
        this._popup = document.querySelector(".popup");
        this._triggers = document.querySelectorAll(".js-popup");
        this._closes = this._popup.querySelectorAll(".js-popup__close");
        this._content = null;
        this._extClass = null;
        this.isOpen = false;
    
        this._handleTriggerClick = this._handleTriggerClick.bind(this);
        this._handleCloseClick = this._handleCloseClick.bind(this);
    }
    init() {
        this._setTriggersClickHandler();
        this._setCloseClickHandler();
    }

    // open. публичный метод - передав сюда название нужного шаблона, откроем попап с соостветствующим содержимым
    open(id, extClass) {
        if(this.isOpen || this._content) {
            this._content.remove();
            this._content = null;
        }
        
        this._popup.classList.add("is-active");
        this._popup.style.opacity = "1";
        if(extClass) {
            this._extClass = extClass;
            this._popup.classList.add(this._extClass);
        }
        hideScroll();
        this.isOpen = true;

        this._renderContent(id);

        // при открытии назначаем обработчики вызовов попапа 
        this._triggers = document.querySelectorAll(".js-popup");
        this._closes = this._popup.querySelectorAll(".js-popup__close");
        this.init();

        
    }

    close() {
        this._popup.style.opacity = "0";
        this._content.style.opacity = "0";
        
        const clearClass = (e) => {
            if(e.propertyName === "opacity" && e.elapsedTime >= 2) {
                this._popup.classList.remove("is-active");
                this._popup.classList.remove(this._extClass);
                this._extClass = null;
    
                this.isOpen = false;
    
                showScroll();
    
                this._popup.removeEventListener("transitionend", clearClass);
            }
        };
        
        this._popup.addEventListener("transitionend", clearClass);

    }

    _renderContent(id) {
        const template = document.querySelector(`[data-tpl-id="${id}"]`);
        this._popup.append(template.content.cloneNode(true));
        this._content = this._popup.querySelector(".popup__inner");
        this._content.style.opacity = 1;

        const contentForm = this._content.querySelector(".form");
        if(contentForm) {
            const formComp = new Form(contentForm);
            formComp.init();
        }
    }

    _handleTriggerClick(e) {
        e.preventDefault();
        const id = e.target.dataset.modalId;
        const extClass = e.target.dataset.modalExtClass;
        if(extClass){
            this.open(id, extClass);
        } else {
            this.open(id);
        }
    }

    _handleCloseClick(e) {
        e.preventDefault();
        if(this.isOpen) {
            this.close();
        }
    }

    _setTriggersClickHandler() {
        if(this._triggers.length === 0) {
            return false;
        }

        this._triggers.forEach(trigger => {
            trigger.addEventListener("click", this._handleTriggerClick);
        });
    }
    _setCloseClickHandler() {
        this._closes.forEach(close => {
            close.addEventListener("click", this._handleCloseClick);
        });
    }
}

const loadAnimate = function() {
    const lazyImages = document.querySelectorAll("[data-lazy-src]");
    const animFooter = document.querySelector(".footer");
    const animFooterElems = animFooter.querySelectorAll("[data-scroll-anim]");
    
    const options = {
        rootMargin: "50px",
        threshold: 0,
    };
    const footerOptions = {
        threshold: 0.25,
    }

    lazyImages.forEach(item => {
        const callback = function(entries) {
            entries.forEach(entry => {
                const {isIntersecting} = entry;
                if(isIntersecting) {
                    item.src = item.dataset.lazySrc;
                    item.closest(".tiles__tile").classList.add("is-loaded");
                }
            })
        }
        const lazyObserver = new IntersectionObserver(callback, options);
        lazyObserver.observe(item);
    });

    const footerCallback = function(entries) {
        entries.forEach(entry => {
            const {isIntersecting} = entry;
            if(isIntersecting) {
                let i = 0;
                let interval = setInterval(function() {
                    if(i < animFooterElems.length) {
                        animFooterElems[i].classList.add("is-animed");
                        i++
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
            };
        });
    };

    const animObserver = new IntersectionObserver(footerCallback, footerOptions);
    animObserver.observe(animFooter);

    
};

// такую функцию вызывать коллбэком при каком-то асинхронном действии, например при загрузке страницы новостей.
const scrollAnimateFadeUp = function() {
    const fadeups = document.querySelectorAll(".scroll-anim.fade-up");
    const singles = document.querySelectorAll(".scroll-anim-single.fade-up");
    const fadeupOptions = {
        threshold: 0.25,
    }
    if(fadeups.length > 0) {    
        fadeups.forEach(item => {
            const childs = Array.from(item.children);
            childs.forEach(child => {
                const fadeupCallback = function(entries) {
                    entries.forEach(entry => {
                        const {isIntersecting} = entry;
                        if(isIntersecting) {
                            child.classList.add("is-animed");
                        }
                    })     
                }
                const fadeUpObserver = new IntersectionObserver(fadeupCallback, fadeupOptions);
                fadeUpObserver.observe(child);
            });
        });
    };
    if(singles.length > 0) {
        singles.forEach(item => {
            const fadeSingleUpCallback = function(entries) {
                entries.forEach(entry => {
                    const {isIntersecting} = entry;
                    if(isIntersecting) {
                        item.classList.add("is-animed");
                    }
                })
            }
            const singleFadeObserver = new IntersectionObserver(fadeSingleUpCallback, fadeupOptions);
            singleFadeObserver.observe(item);
        });
    };
};

class Form {
    constructor(el) {
        this._el = el;

        this._handleSubmit = this._handleSubmit.bind(this);
    }

    init() {
        console.log(this._el);
    }

    // валидация полей формы

    // отправка формы
    _setSubmitHandler() {
        this._el.addEventListener("submit", this._handleSubmit);
    }
    _handleSubmit() {

    }
    // обслуживание загрузки и удаления файла
    
    // вызов сообщения об успешной отправке - вызов попапа

    // после успешной отправки формы использовать popup.open("form-success", ".popup--small")
    // после успешной отправки комментария использовать popup.open("comment-success", ".popup--small")
}

const forms = function() {
    // all existed in onload forms
    const forms = document.querySelectorAll(".form");
    if(forms.length === 0) {
        return false;
    }
    forms.forEach(form => {
        const formComp = new Form(form);
        formComp.init();
    })
};

// debounce
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function getScrollbarSize() { 
    let outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    document.body.appendChild(outer);
    let widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    let inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    let widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
}
// запрет скролла, фиксирует документ
const hideScroll = function () {
    if(document.body.classList.contains("modal-open")) {
        return false;
    }
    document.body.classList.add("modal-open");
    window._scrollTop = window.pageYOffset;
    document.body.style.position = "fixed";
    document.body.style.top = -window._scrollTop + "px"; // eslint-disable-line
    document.body.style.width = `calc(100% - ${getScrollbarSize()}px)`;
    const fixHeader = document.querySelector(".header");
    if(header) {
        fixHeader.style.width = `calc(100% - ${getScrollbarSize()}px)`;
    }
};
// снимает запрет прокрутки
const showScroll = function () {
    if(!document.body.classList.contains("modal-open")) {
        return false;
    }
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    document.body.style.position = "";
    document.body.style.width = "";
    window.scroll(0, window._scrollTop);

    const fixHeader = document.querySelector(".header");
    if(header) {
        fixHeader.style.width = "";
    }
};

// infoslider, mobile - accordeon. Dynamic width indicator
const infoSlider = function() {
    class Infoslider {
        constructor(el) {
            this._el = el;
            this._head = this._el.querySelector(".infoslider__head");
            this._tabcontainer = this._el.querySelector(".infoslider__tabs");
            this._tabs = this._el.querySelectorAll(".infoslider__tab");
            this._body = this._el.querySelector(".infoslider__body");
            this._caret = this._tabcontainer.querySelector(".infoslider__indicator-caret");
            this._tabActive = this._tabcontainer.querySelector(".is-active");
            this._isDropped = false;
            
            this._swiper = null,
            this._options = {
                init: false,
                slidesPerView: 1,
                pagination: false,
                allowTouchMove: false,
                on: {
                    init: function() {
                        this.el.style.height = this.slides[this.activeIndex].offsetHeight + "px";
                    },
                    slideChange: function() {
                        this.el.style = "";
                        this.el.style.height = this.slides[this.activeIndex].offsetHeight + "px";
                    }
                }
            };

            this._handleResize = this._handleResize.bind(this);
            this._handleTabClick = this._handleTabClick.bind(this);
            this._handleHeadClick = this._handleHeadClick.bind(this);
        }

        init() {
            this._calcCaretState();
            this._setTabClickHandler();
            this._setHeadClickHandler();
            this._setResizeHandler();
            this._swiper = new Swiper(this._body, this._options); // eslint-disable-line
            this._swiper.init();
            this._swiper.slideTo(this._defineSlideOnSwiper());
        }

        _setHeadClickHandler() {
            this._head.addEventListener("click", this._handleHeadClick);
        }

        _setTabClickHandler() {
            this._tabs.forEach(tab => {
                tab.addEventListener("click", this._handleTabClick);
            });
        }
        _setResizeHandler() {
            const optimizedHandler = debounce(this._handleResize);
            window.addEventListener("resize", optimizedHandler);
        }

        _calcCaretState() {
            if(window.innerWidth <= 768) {
                return false;
            }
            const current = this._tabcontainer.querySelector(".is-active");
            const width = current.offsetWidth;
            const left = current.offsetLeft;
            this._caret.style.width = width + "px";
            this._caret.style.left = left + "px";
        }

        _handleTabClick(e) {
            e.preventDefault();
            this._tabActive.classList.remove("is-active");
            this._tabActive = e.target;
            this._tabActive.classList.add("is-active");
            this._calcCaretState();
            this._swiper.slideTo(this._defineSlideOnSwiper());
        }

        _handleHeadClick(e) {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                if(this._isDropped === false) {
                    this._head.classList.add("is-active");
                    this._isDropped = true;
                } else {
                    this._head.classList.remove("is-active");
                    this._isDropped = false;
                }
            }
        }

        _handleResize() {
            if(window.matchMedia("(min-width: 769px)").matches) {
                this._calcCaretState();
            }
        }
        
        _defineSlideOnSwiper() {
            const activeName = this._tabActive.dataset.infosliderTab;
            const newSlide = this._body.querySelector(`[data-infoslider-tab="${activeName}"]`);
            return this._swiper.slides.indexOf(newSlide);
        }
    }

    const blocks = document.querySelectorAll(".infoslider");
    if(blocks.length === 0) {
        return;
    }
    blocks.forEach(block => {
        const infoslider = new Infoslider(block);
        infoslider.init();
    });
};

// other news http slider
const otherNews = function() {
    // обработчики кликов по кнопкам навигации

    // запрос на сервер

    // отрисовка результата 
};

// compose - mobile slider
const composeSlider = function() {
    class Compose {
        constructor(el) {
            this._el = el;
            this._swiper = null;
            this._nav = this._el.querySelector(".compose__navigation");
            this._options = {
                init: false,
                slidesPerView: 1,
                pagination: {
                    el: this._nav,
                },
            };
            this._handleResize = this._handleResize.bind(this);
        }

        init() {
            this._swiper = new Swiper(this._el, this._options); // eslint-disable-line
            this._setDocResize();
            if(window.innerWidth <= 640) {
                this._swiper.init();
            }
        }

        _setDocResize() {
            window.addEventListener("resize", this._handleResize);
        }

        _handleResize() {
            if(this._swiper.initialized) {
                if(window.innerWidth > 640) {
                    this._swiper.destroy();
                }
            } else {
                if(window.innerWidth <= 640) {
                    this._swiper = new Swiper(this._el, this._options); // eslint-disable-line
                    this._swiper.init();
                }
            }
        }
    }

    const composeSliders = document.querySelectorAll(".compose-slider");
    if(composeSliders.length === 0) {
        return;
    }
    composeSliders.forEach(sliderEl => {
        // const nav = sliderEl
        const slider = new Compose(sliderEl);
        slider.init();
    });
};

// items slider
const itemsSlider = function() {
    class ItemsSlider {
        constructor(el) {
            this._el = el;
            this._nav = this._el.querySelector(".items-slider__navigation");
            this._options = {
                slidesPerView: 1,
                pagination: {
                    el: this._nav,
                },
                breakpoints: {
                    769: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    }
                },
                on: {
                    init: function() {
                        if(window.innerWidth > 768) {
                            if(this.slides.length <= 2) {
                                this.enabled = false;
                            }
                        } else {
                            if(this.slides.length === 1) {
                                this.enabled = false;
                            }
                        }
                    }
                }
            };
            this._swiper = null;
            this._handleResize = this._handleResize.bind(this);
        }
        init() {
            this._swiper = new Swiper(this._el, this._options); // eslint-disable-line
            this._setDocResize();
        }
        _setDocResize() {
            window.addEventListener("resize", this._handleResize);
        }
        _handleResize() {
            if(window.innerWidth > 768) {
                if(this._swiper.slides.length <= 2) {
                    this._swiper.disable();
                } else {
                    this._swiper.enable();
                }
            } else {
                if(this._swiper.slides.length === 1) {
                    this._swiper.disable();
                } else {
                    this._swiper.enable();
                }
            }
            
        }
    }
    const sliders = document.querySelectorAll(".items-slider");
    sliders.forEach(sliderEl => {
        const slider = new ItemsSlider(sliderEl);
        slider.init();
    });
};

// press - share toggling
const shareToggle = function() {
    const section = document.querySelector(".actions-bar");
    if(!section) {
        return false;
    }
    const btn = section.querySelector(".actions-bar__share");
    const block = section.querySelector(".actions-bar__share-links");
    btn.addEventListener("click", function() {
        block.classList.toggle("is-active");
    });
};

// history - mobile accordeon
const historyAccordeon = function() {
    const section = document.querySelector(".history-section");
    if(!section) {
        return false;
    }

    const cards = section.querySelectorAll(".history-card");

    cards.forEach(card => {
        const head = card.querySelector("header > *:first-child");
        head.addEventListener("click", function() {
            if(!card.classList.contains("is-active")) {
                card.classList.add("is-active");
                card.style.height = card.scrollHeight + "px";
            } else {
                card.classList.remove("is-active");
                card.style.height = "";
            }
        });
    });
};

// careerAccordeon
const careerAccordeon = function() {
    const items = document.querySelectorAll(".vacancy");
    if(items.length === 0) {
        return;
    }
    items.forEach(item => {
        const head = item.querySelector(".vacancy__head");
        const body = item.querySelector(".vacancy__body");

        // init
        if(item.classList.contains("is-active")) {
            body.style.height = body.scrollHeight + "px";
        }

        head.addEventListener("click", function(e) {
            e.preventDefault();
            if(!item.classList.contains("is-active")) {
                item.classList.add("is-active");
                body.style.height = body.scrollHeight + "px";
            } else {
                item.classList.remove("is-active");
                body.style.height = "";
            }
        });
    });
};

const footerAccordeon = () => {
    const triggers = document.querySelectorAll(".footer__title");
    triggers.forEach(trg => {
        trg.addEventListener("click", function() {
            if(!trg.parentElement.classList.contains("is-active")) {
                trg.parentElement.classList.add("is-active");
                trg.parentElement.style.height = trg.parentElement.scrollHeight + "px";
            } else {
                trg.parentElement.classList.remove("is-active");
                trg.parentElement.style.height = "";
            
            }
        });
    });

};

window.onload = function() {
    heroSlider();
    header();
    historyAccordeon();
    footerAccordeon();
    careerAccordeon();
    shareToggle();
    composeSlider();
    itemsSlider();
    otherNews();
    infoSlider();
    gallery();
    loadAnimate();
    scrollAnimateFadeUp();
    forms();

    const popup = new Popup();
    popup.init();
};



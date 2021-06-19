// import "./import/swiper-bundle.min.js";
import footerAccordeon from "%modules%/footer/footer";
import header from "%modules%/header/header";

// index slider
// много заморочек с загрузкой медиа
// -- на десктопе мы загружаем видео по мере листания слайдера
// -- присутствует фоллбэк-картинка. грузится все сразу - просто при смене слайда мы сразу видим фоллбэк-картинку, а потом подгружается видео и оно проигрывается поверх картинки
// -- ленивая загрузка видео с условием на ширину экрана
// -- прогресс-бар в буллит пагинации
const heroSlider = function() {
    class HeroSlider {
        constructor(el) {
            this._el = el;
            this._objects = this._el.querySelector(".hero-slider__objects");
            this._labels = this._el.querySelector(".hero-slider__labels");
            this._objectsOptions = {
                loop: true,
                speed: 500,
                // init: false,
                lazy: {
                    loadPrevNext: true,
                    loadOnTransitionStart: true,
                    loadPrevNextAmount: 5
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
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
                }
            };
            this._labelsOptions = {

            };
            this._objectsSwiper = null;
            this._labelsSwiper = null;
        }
        init() {
            console.log(this._el);
            this._objectsSwiper = new Swiper(this._objects, this._objectsOptions); // eslint-disable-line
        }
    }

    const heroSliderEl = document.querySelector(".hero-slider");
    if(!heroSliderEl) {
        return false;
    }
    const heroSliderComp = new HeroSlider(heroSliderEl);
    heroSliderComp.init();
};


// gallery call

// gallery

// popup

// animation on load blocks - intersection observer

// forms - validation, file uploads

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
            this._options.activeIndex = this._defineSlideOnSwiper();
            this._swiper.init();
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
};



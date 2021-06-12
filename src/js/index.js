// import "./import/swiper-bundle.min.js";
import footerAccordeon from "%modules%/footer/footer";
import header from "%modules%/header/header";

// index slider

// gallery call

// gallery

// popup

// animation on load blocks - intersection observer

// forms - validation, file uploads

// infoslider, mobile - accordeon. Dynamic width indicator
const infoSlider = function() {
    class Infoslider {
        constructor(el) {
            this._el = el;
            this._head = this._el.querySelector(".infoslider__head");
            this._tabcontainer = this._el.querySelector(".infoslider__tabs");
            this._tabs = this._el.querySelectorAll(".infoslider__tab");
            this._caret = this._tabcontainer.querySelector(".infoslider__indicator-caret");

            this._tabActive = this._tabcontainer.querySelector(".is-active");


            this._handleResize = this._handleResize.bind(this);
            this._handleTabClick = this._handleTabClick.bind(this);
            this._handleHeadClick = this._handleHeadClick.bind(this);
        }

        init() {
            this._calcCaretState();
            this._setTabClickHandler();
            this._setHeadClickHandler();
            this._setResizeHandler();
        }

        _setResizeHandler() {

        }

        _setHeadClickHandler() {
            this._head.addEventListener("click", this._handleHeadClick);
        }

        _setTabClickHandler() {
            this._tabs.forEach(tab => {
                tab.addEventListener("click", this._handleTabClick);
            });
        }

        _calcCaretState() {
            const current = this._tabcontainer.querySelector(".is-active");
            const width = current.offsetWidth;
            const left = current.offsetLeft;
            this._caret.style.width = width + "px";
            this._caret.style.left = left + "px";
        }

        _handleResize() {
            // дропдаун вместо табов на мобилке
        }

        _handleTabClick(e) {
            // переключение активного таба и активного слайда
            // переключение позиции и размер каретки при переключении табов
            // клик на мобильной версии - раскрытие дропдауна
            if(window.innerWidth > 768) {
                e.preventDefault();
                this._tabActive.classList.remove("is-active");
                this._tabActive = e.target;
                this._tabActive.classList.add("is-active");
                this._calcCaretState();
            }
        }

        _handleHeadClick(e) {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                this._head.classList.toggle("is-active");
            }
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

header();
historyAccordeon();
footerAccordeon();
careerAccordeon();
shareToggle();
composeSlider();
itemsSlider();
otherNews();
infoSlider();


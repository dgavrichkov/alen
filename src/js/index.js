// import "./import/swiper-bundle.min.js";
import footerAccordeon from "%modules%/footer/footer";
import header from "%modules%/header/header";

// index slider

// gallery call

// compose - mobile slider
const composeSlider = function() {
    class Compose {
        constructor(el, nav) {
            this._el = el;
            this._swiper = null;
            this._nav = nav;
            this._options = {
                init: false,
                slidesPerView: 1,
                pagination: {
                    el: nav,
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
        const nav = sliderEl.querySelector(".compose__navigation");
        const slider = new Compose(sliderEl, nav);
        slider.init();
    });
};

// gallery

// infoslider, mobile - accordeon. Dynamic width indicator

// items slider
const itemsSlider = function() {
    class ItemsSlider {
        constructor(el, nav) {
            this._el = el;
            this._options = {
                slidesPerView: 1,
                pagination: {
                    el: nav,
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
        const nav = sliderEl.querySelector(".items-slider__navigation");
        const slider = new ItemsSlider(sliderEl, nav);
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

// other news slider

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
// popup

// animation on load blocks - intersection observer

// forms - validation, file uploads

header();
historyAccordeon();
footerAccordeon();
careerAccordeon();
shareToggle();
composeSlider();
itemsSlider();


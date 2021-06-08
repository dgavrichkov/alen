class Header {
    constructor(headerEl) {
        this._header = headerEl;
        this._menu = this._header.querySelector(".header__menu");
        this._search = this._header.querySelector(".header__search");
        this._submenu = this._header.querySelector(".header__submenu");
        this._burger = this._header.querySelector(".header__mobile-burger");
        this._mobmenu = this._header.querySelector(".header__mobile-menu");

        this._oldScroll = 0;
        this._isBurgerOpen = false;
        this._isSearchOpen = false;

        this._handlerScrolling = this._handlerScrolling.bind(this);
        this._handlerBurger = this._handlerBurger.bind(this);
        this._handlerSearch = this._handlerSearch.bind(this);
    }

    init() {
        console.log("header is ready", this._header);
        this._setHandlerScrolling();
        this._setHandlerBurger();
        this._setHandlerSearch();
    }

    // scrolling
    _setHandlerScrolling() {
        document.addEventListener("scroll", this._handlerScrolling);
    }
    _handlerScrolling() {
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
    // - set background on open burger

    _setHandlerBurger() {
        this._burger.addEventListener("click", this._handlerBurger);
    }
    _handlerBurger(e) {
        e.preventDefault();
        console.log(this._burger);
        if(this._isBurgerOpen) {
            this._delClassIsBurger();
            this._isBurgerOpen = false;
            this._bodyUnfreeze();
        } else {
            this._setClassIsBurger();
            this._isBurgerOpen = true;
            this._bodyFreeze();
        }
    }

    // - search handling
    // open search
    // - set background on open search
    // close search
    _setHandlerSearch() {
        const triggers = this._header.querySelectorAll(".js-search-trigger");
        triggers.forEach(trg => {
            trg.addEventListener("click", this._handlerSearch);
        });
    }
    _handlerSearch(e) {
        e.preventDefault();
        if(this._isSearchOpen) {
            this._delClassIsSearch();
            this._isSearchOpen = false;
        } else {
            this._setClassIsSearch();
            this._isSearchOpen = true;
        }

    }

    // submenu
    // resize
    // init to dropdown ??
    // destroy dropdown ??
    // - dropdown handling
    // open dropdown
    // close dropdown


    // what we need to do
    // - fix scrolling when search or burger opened
    // - add is-scrolled when scroll
    // - add is-hidden if scroll direct to bottom of page
    // - add is-burger on opening burger
    // - del is-burger on closing burger
    // - del is-hidden if scroll direct to top
    // - del is-scrolled when header set on max top
    // - add is-search when search opened
    // - del is-search when search closed
    // - set submenu as dropdown when width <= 1024

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

export default header;
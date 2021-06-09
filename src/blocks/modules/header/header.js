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
    
    // submenu
    // resize
    // destroy dropdown ??
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

    // what we need to do
    // - fix scrolling when search or burger opened
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
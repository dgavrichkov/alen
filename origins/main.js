if (!window.inited) {
    var inited = window.inited = false;
    var init_js = null;
    var templs = null;
    var pages = null;
    var XHRequests = null;
    var scrollToHash = 0;
    if (!myMap) var myMap;
    else {
        myMap.destroy();
    }
    if (!myMapFull) var myMapFull;
    else {
        myMapFull.destroy();
    }

    $(document).ready(function () {
        ymaps.ready(function () {
            init_js();
            setWindowHeight();
            inited = window.inited = true;
        });
        if (window.location.hash.length > 0) {
            window.hashName = window.location.hash;
            scrollToHash =
                $(window.hashName).offset().top -
                $(window).height() / 2 -
                $(window.hashName).height() / 2;
        } else {
            scrollToHash = 0;
        }
        //document.scrollTop = scrollToHash;
        // $(document).scrollTop(scrollToHash)
    });
    document.addEventListener(
        "touchmove",
        function (event) {
            event = event.originalEvent || event;
            if (event.scale !== 1) {
                var dir = location.href.split("?")[0].split("/");
                if (dir[3] == "" || (dir[3] == "en" && dir[4] == "")) {
                    if (event.preventDefault) event.preventDefault();
                }
            }
        }, {
            passive: false
        }
    );
}
// надо бы разобраться с этой штучкой. кой-где скорее всего устанавливаются пропорции изображения от этих кастомных свойств
var setWindowHeight = function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
};

$(window).on("load", function () {
    $("html,body").animate({
        scrollTop: scrollToHash
    },
    1000
    );
    pages.main.slider.init();
});

$(window).on("resize", function () {
    setWindowHeight();
});

window.addEventListener(
    "orientationchange",
    function () {
        setWindowHeight();
    },
    false
);

init_js = function () {
    templs.init();
    pages.init();
    XHRequests.init();
};

templs = {
    header: {
        usersNoScroll: 0,
        box: null,
        srcrollFix: {
            // нужно для заклинивания скролла. На сайте это сделано не через css - попытка прокрутки доступна, но скролл всегда возвращается в исходное положение.
            del: function () {
                this.parent.usersNoScroll--;
                if (this.parent.usersNoScroll === 0) {
                    $("body").removeClass("scrollDis");
                }
            },
            add: function () {
                this.parent.usersNoScroll++;
                $("body").addClass("scrollDis");
            }
        },
        search: {
            state: "closed",
            animate: false,
            box: null,
            searchBut: null,
            backgroundPage: "<div class='header_bg bg_search'></div>",
            basicTimeAnimate: 600,
            mobileSearchBut: null,
            _appendBg: function () {
                var _this = this;
                $(document)
                    .find(".header")
                    .append(this.backgroundPage);
                var bg = $(document)
                    .find(".header")
                    .find(".header_bg.bg_search");
                bg.css("display", "block");
                $(".header_mobile_search").animate({
                    opacity: 1
                },
                this.basicTimeAnimate,
                "linear"
                );
                bg.animate({
                    opacity: 1
                },
                this.basicTimeAnimate,
                "linear",
                function () {
                    _this.animate = false;
                    _this.state = "opened";
                }
                );
            },
            _removeBg: function (callback) {
                var _this = this;
                var bg = $(document)
                    .find(".header")
                    .find(".header_bg.bg_search");
                $(".header_mobile_search").animate({
                    opacity: 0
                },
                this.basicTimeAnimate,
                "linear"
                );
                bg.animate({
                    opacity: 0
                },
                this.basicTimeAnimate,
                "linear",
                function () {
                    bg.remove();
                    _this.animate = false;
                    _this.state = "closed";
                    callback();
                }
                );
            },
            open: function () {
                this.parent.srcrollFix.add();
                this.animate = true;
                $(document)
                    .find(".header")
                    .eq(0)
                    .toggleClass("searchOpen");
                $(document)
                    .find(".header_search_input")
                    .eq(0)
                    .focus();
                $(document)
                    .find(".header_search_wrapper")
                    .eq(0)
                    .toggleClass("open");
                var _this = this;
                setTimeout(function () {
                    _this._appendBg();
                }, this.basicTimeAnimate - 50);
            },
            close: function () {
                this.parent.srcrollFix.del();
                var _this = this;
                this.animate = true;
                $(document)
                    .find(".header_search_wrapper")
                    .removeClass("open");
                this._removeBg(function () {
                    $(document)
                        .find(".header_mobileMenu")
                        .animate({
                            opacity: 1
                        });
                    $(document)
                        .find(".header")
                        .toggleClass("searchOpen");
                });
            },
            events: function () {
                var _this = this;
                if (!inited) {
                    $(document).on("click", ".header_search_but", function (e) {
                        e.preventDefault();
                        if (!_this.animate) {
                            if (_this.state === "closed") _this.open();
                            else if (_this.state === "opened") {
                                _this.close();
                            }
                        }
                    });
                    $(document).on("click", ".header_mobileMenu_search", function (e) {
                        if ($(window).width() <= 1024) {
                            e.preventDefault();
                            if (!_this.animate) {
                                if (_this.state === "closed") {
                                    $(".header_mobileMenu").animate({
                                        opacity: 0
                                    });
                                    _this.open();
                                }
                            }
                        }
                    });
                    $(document).on("click", ".header_mobile_search", function (e) {
                        if ($(window).width() <= 1024) {
                            e.preventDefault();
                            if (!_this.animate) {
                                if (_this.state === "opened") {
                                    if (
                                        $(document)
                                            .find(".header_mobileMenu")
                                            .hasClass("open")
                                    )
                                        _this.close();
                                }
                            }
                        }
                    });
                    $(document).on("click", ".header_search_input_close", function (e) {
                        e.preventDefault();
                        if (_this.state === "opened") {
                            _this.close();
                        }
                    });
                }
                document.addEventListener("keydown", function (e) {
                    if (_this.state === "opened" && e.keyCode === 27) {
                        _this.close();
                    }
                });
            },
            init: function () {
                this.state = "closed";
                this.animate = false;
                this.closeBut = $(document).find(".header_search_input_close");
                this.searchBut = $(document).find(".header_search_but");
                if (!inited) this.events();
            }
        },
        scrolling: {
            header: $(".header"),
            dMove: 20,
            oldScroll: 0,
            events: function () {
                this.eventsInited = true;
                var _this = this;
                $(document).scroll(function () {
                    _this._doing($(this).scrollTop());
                });
            },
            _doing: function (scrollTop, firstInit) {
                if (!firstInit) firstInit = false;
                // это наверное обеспечивает некоторое пространство перед скрытием хедера
                if (
                    this.dMove < Math.abs(scrollTop - this.oldScroll) ||
                    scrollTop == 0 ||
                    firstInit
                ) {
                    if (this.oldScroll < scrollTop) {
                        if (scrollTop > this.header.height()) {
                            this.header.addClass("hide");
                            this.header.addClass("scrolled");
                        }
                    } else {
                        if (scrollTop > this.header.height() || firstInit) {
                            this.header.removeClass("hide");
                            this.header.addClass("scrolled");
                        }
                    }
                    if (scrollTop == 0) {
                        if (!this.header.hasClass("scrolled-ever"))
                            this.header.removeClass("scrolled");
                    }
                    this.oldScroll = scrollTop;
                }
                if (scrollTop == 0) {
                    if (!this.header.hasClass("scrolled-ever"))
                        this.header.removeClass("scrolled");
                }
            },
            init: function () {
                this.header = $(".header");
                if (!this.eventsInited) this.events();
                this.oldScroll = $(document).scrollTop();
                this._doing($(document).scrollTop(), true);
            }
        },
        burger: {
            state: "closed",
            animate: false,
            menu: $(".header_mobileMenu"),
            backgroundPage: "<div class='header_bg bg_burger'></div>",
            basicTimeAnimate: 600,
            basicDelay: 50,
            language: {
                state: "closed",
                but: $(".header_mobileMenu_lang_title"),
                wrapper: $(".header_mobileMenu_lang_wrapper"),
                list: $(".header_mobileMenu_lang_list"),
                items: null,
                animate: false,
                basicTimeAnimate: 500,
                basicDelay: 100,
                events: function () {
                    var _this = this;
                    this.but.click(function (e) {
                        e.preventDefault();
                        if (!_this.animate) {
                            if (_this.state === "closed") {
                                _this.open();
                            } else {
                                _this.close();
                            }
                        }
                    });
                },
                open: function () {
                    this.animate = true;
                    this.but.parent().addClass("active");
                    this.wrapper.addClass("open");
                    var _this = this;
                    setTimeout(function () {
                        _this.showElements();
                    }, this.basicTimeAnimate * 2);
                    this.state = "opened";
                },
                showElements: function () {
                    var _this = this;
                    for (var i = 0; i < _this.items.length; i++) {
                        _this.items
                            .eq(i)
                            .delay(_this.basicDelay * (_this.items.length - i - 1))
                            .fadeIn(_this.basicTimeAnimate);
                    }
                    setTimeout(function () {
                        _this.animate = false;
                    }, _this.basicDelay * this.items.length);
                },
                close: function () {
                    var _this = this;
                    _this.hideElements(function () {
                        _this.but.parent().removeClass("active");
                        _this.wrapper.removeClass("open");
                    });
                    this.state = "closed";
                },
                hideElements: function (callBack) {
                    var _this = this;
                    for (var i = 0; i < _this.items.length; i++) {
                        _this.items
                            .eq(i)
                            .delay(_this.basicDelay * i)
                            .fadeOut(_this.basicTimeAnimate);
                    }
                    setTimeout(function () {
                        setTimeout(function () {
                            if (callBack) callBack();
                        }, _this.basicTimeAnimate * 2);
                        _this.animate = false;
                    }, _this.basicDelay * (this.items.length - 1));
                },
                init: function () {
                    this.but = $(".header_mobileMenu_lang_title");
                    this.wrapper = $(".header_mobileMenu_lang_wrapper");
                    this.list = $(".header_mobileMenu_lang_list");
                    this.items = this.list.find(".header_mobileMenu_lang_item");
                    this.items.fadeOut();
                    if (!inited) this.events();
                }
            },
            _appendBg: function () {
                var _this = this;
                $(document)
                    .find(".header")
                    .find(".header_bg")
                    .remove();
                $(document)
                    .find(".header")
                    .append(this.backgroundPage);
                var bg = $(document)
                    .find(".header")
                    .find(".header_bg.bg_burger");
                bg.css("display", "block");
                bg.animate(
                    {
                        opacity: 1
                    },
                    this.basicTimeAnimate,
                    "linear",
                    function () {
                        _this.animate = false;
                        _this.state = "opened";
                    }
                );
            },
            _removeBg: function (callback) {
                var _this = this;
                var bg = $(document)
                    .find(".header")
                    .find(".header_bg.bg_burger");
                bg.animate({
                    opacity: 0
                },
                this.basicTimeAnimate,
                "linear",
                function () {
                    bg.remove();
                    _this.animate = false;
                    _this.state = "closed";
                    if (callback) callback();
                }
                );
            },
            events: function () {
                var _this = this;
                click = function (e) {
                    e.preventDefault();
                    if (!_this.animate) {
                        _this.animate = true;
                        if (_this.state === "closed") {
                            _this.parent.srcrollFix.add();
                            _this.open();
                        } else {
                            _this.close();
                            _this.parent.srcrollFix.del();
                        }
                    }
                };
                if (!inited)
                    $(document).on("click", ".header_mobile_burger", function (e) {
                        click(e);
                    });
                $(document)
                    .find(
                        ".header_mobileMenu_item:not(.header_mobileMenu_search):not(.language)"
                    )
                    .unbind("click");
                $(
                    ".header_mobileMenu_item:not(.header_mobileMenu_search):not(.language)"
                ).click(function () {
                    _this.close();
                    _this.parent.srcrollFix.del();
                });
                $(window).on("resize", function () {
                    if (_this.state === "opened" && $(window).width() > 1024) {
                        _this.close();
                        _this.parent.srcrollFix.del();
                    }
                });
            },
            _elementsFadeIn: function () {
                var _this = this;
                var num2 = 0;
                var elems = $(document).find(".header_mobileMenu_item");
                var fadeInEl = setInterval(function () {
                    if (num2 < elems.length) {
                        elems.eq(num2).addClass("faded");
                        num2++;
                    } else {
                        clearInterval(fadeInEl);
                    }
                }, _this.basicDelay);
            },
            _elementsFadeOut: function (callback) {
                var elems = $(document).find(".header_mobileMenu_item");
                var _this = this;
                var num = elems.length - 1;
                var fadeOutEl = setInterval(function () {
                    if (num >= 0) {
                        elems.eq(num).removeClass("faded");
                        num--;
                    } else {
                        if (callback) callback();
                        clearInterval(fadeOutEl);
                    }
                }, _this.basicDelay);
            },
            open: function () {
                this.menu.addClass("open");
                $(document)
                    .find(".header")
                    .addClass("burgerOpen");
                var _this = this;
                $(".header_mobileMenu_item");
                this._elementsFadeIn();
                _this.menu.animate({
                    opacity: 1
                },
                _this.basicTimeAnimate
                );
                this._appendBg();
            },
            close: function () {
                var _this = this;
                this.language.close();
                _this._elementsFadeOut(function () {
                    _this.menu.removeClass("open");
                });
                this.menu.animate({
                    opacity: 0
                },
                this.basicTimeAnimate,
                function () {
                    _this._removeBg();
                    $(document)
                        .find(".header")
                        .removeClass("burgerOpen");
                }
                );
            },
            init: function () {
                this.but = null;

                this.menu = null;
                this.menu = $(".header_mobileMenu");
                this.language.init();
                $(document)
                    .find(".header_mobile_burger")
                    .off();
                this.events();
                this.animate = false;
                this.state = "closed";
                this.close();
            }
        },
        dropDown: {
            events: function () {
                $(document).on("click", ".header_menuSub", function () {
                    if ($(window).width() <= 1024) {
                        if ($(this).hasClass("active")) {
                            $(this).attr("style", "");
                        } else {
                            $(this).height(
                                $(this)
                                    .find(".header_menuSub_box")
                                    .height() + 15
                            );
                        }
                    }
                    $(this).toggleClass("active");
                });
            },
            init: function () {
                if (!inited) this.events();
            }
        },
        menu: {
            // должно быть, это как-то связано с этими странными заглушками при переходе между урлами. Этот метод всего лишь убирает активный класс при клике по лого (ссылка на главную), или же назначает активный класс кликнутой ссылке в меню
            // подход в корне неверный, т.к. в таких случаях состояние должно изменяться только после ответа сервера
            events: function () {
                this.eventsInited = true;
                $(".header_logo").click(function () {
                    $(".header_menu_item").removeClass("active");
                });
                $(".header_menu_item").click(function () {
                    $(".header_menu_item").removeClass("active");
                    $(this).addClass("active");
                });
            },
            init: function () {
                if (!this.eventsInited) this.events();
            }
        },
        init: function () {
            this.srcrollFix.parent = this;
            this.search.parent = this;
            this.scrolling.parent = this;
            this.burger.parent = this;
            this.box = $(".header");

            this.search.init();
            this.scrolling.init();
            this.burger.init();
            this.menu.init();
            if ($(".header_menuSub")) this.dropDown.init();
        }
    },
    footer: {
        box: null,
        menus: null,
        animed: false,
        anim: function () {
            if (!this.animed) {
                this.animed = true;
                var i = 0;
                // находит ряд элементов
                var items = $(document).find(
                    ".footer_menu_wrapper,.footer_col:last-child, .footer_col:last-child .footer_title"
                );
                var intrvl = setInterval(function () {
                    if (i < items.length) {
                        items.eq(i).addClass("show");
                        i++;
                    } else {
                        clearInterval(intrvl);
                    }
                }, 100);
            }
        },
        checkAnim: function () {
            var _this = this;
            if ($(document).find(".footer").length > 0) {
                if (
                    $(window).height() + $(document).scrollTop() >
                    $(document)
                        .find(".footer")
                        .offset().top +
                    100
                ) {
                    _this.anim();
                }
            }
        },
        events: function () {
            var _this = this;
            if (!inited)
                $(document).on("click", ".footer_menu_wrapper", function () {
                    if ($(window).width() <= 1024) {
                        if ($(this).hasClass("active")) {
                            _this.close($(this));
                        } else {
                            _this.open($(this));
                        }
                    }
                });
            $(document).scroll(function () {
                _this.checkAnim();
            });
        },
        open: function (targetC) {
            targetC.addClass("active");
            var tempH = targetC.find(".footer_menu").height() + targetC.height();
            targetC.height(tempH);
        },
        close: function (targetC) {
            targetC.removeClass("active");
            targetC.height(50);
        },
        init: function () {
            this.animed = false;
            this.box = $(".footer");
            this.checkAnim();
            this.events();
        }
    },
    popup: {
        basicTimeAnimate: 2000,
        opened: false,
        open: function (id, addClass) {
            this.opened = true;
            $(".popup").addClass("active");
            if (addClass) {
                $(".popup").addClass(addClass);
            }
            $(".popup_item").removeClass("active");
            $(".popup_item" + id).addClass("active");
            $(".popup").animate({
                opacity: 1
            },
            this.basicTimeAnimate
            );
            $(".popup_item" + id).animate({
                opacity: 1
            },
            this.basicTimeAnimate
            );
            $("body").addClass("scrollDis");
        },
        close: function () {
            var _ = this;
            this.opened = false;
            $(".popup,.popup_item").animate({
                opacity: 0
            },
            this.basicTimeAnimate,
            function () {
                if (!_.opened) {
                    $(".popup,.popup_item").removeClass("active");
                    $(".popup").removeClass("inWindow");
                }
            }
            );
            $("body").removeClass("scrollDis");
            this.parent.gallery.clear();
        },
        events: function () {
            var _this = this;
            this.eventsInited = true;
            $(document).on("click", ".js-popup", function (e) {
                e.preventDefault();
                //if(!$(this).hasClass('mobile-modal') || $(window).width()<768){
                if (!$("#photorama").hasClass("active"))
                    _this.open($(this).attr("href"));
                // }
            });
            $(".popup_close,.close_but").click(function (e) {
                e.preventDefault();
                _this.close();
            });
            document.addEventListener("keydown", function (e) {
                if ($(".popup_item").hasClass("active") && e.keyCode === 27)
                    _this.close();
            });
        },
        forms: {
            submits: function () {
                var _this = this;
                // обработка отправки формы карьеры, видимо эта форма единственная для всех попапов
                $(".popup_item#careers form").submit(function (e) {
                    e.preventDefault();
                    $(this)
                        .find("input,textarea")
                        .val("");
                    $(this)
                        .find(".form_fileList .list .item")
                        .remove();
                    _this.popups.open("#careers-succes"); // открывает попап с сообщением об успехе, надо думать
                });
            },
            init: function () {
                this.submits();
            }
        },
        init: function () {
            if (!this.eventsInited)
                this.events();
            this.forms.popups = this;
            this.forms.init();
        }
    },
    form: {
        files: [],
        uploadFiles: function (event, inputFile) {
            var _this = this;
            event.stopPropagation();
            event.preventDefault();
            var succesTextLoad = inputFile.attr("succesTextLoad");
            var errorTextLoad = inputFile.attr("errorTextLoad");
            var proccesTextLoad = inputFile.attr("proccesTextLoad");
            this.files.forEach(function (item, key) {
                var data_ = new FormData();
                data_.append(key, item.file);
                item.box
                    .find(".text")
                    .html(proccesTextLoad)
                    .parent()
                    .removeClass("error");
                $.ajax({
                    url: "/local/templates/main/ajax_file_upload/upload.php",
                    type: "POST",
                    data: data_,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (a, textStatus, jqXHR) {
                        if (a.error_text) {
                            item.box.remove();
                        } else {
                            $.ajax({
                                type: "POST",
                                url: "/local/templates/main/ajax_file_upload/files.php",
                                data: {
                                    data: a
                                },
                                success: function (a) {
                                    if (a) {
                                        var file = a.split("#")[0];
                                        var size = a.split("#")[1];
                                        item.box
                                            .find(".text")
                                            .html(
                                                succesTextLoad +
                                                " <span>" +
                                                file.replace("/upload/", "") +
                                                " " +
                                                size +
                                                "</span>"
                                            );
                                        item.box.removeClass("loading");
                                        item.box.append(
                                            "<input style=\"display:none\" type=\"file\" name=\"file_" +
                                            key +
                                            "\" value=\"" +
                                            file +
                                            "\"/>"
                                        );
                                        item.box.addClass("load");
                                    } else {
                                        item.box.find(".text").html(errorTextLoad);
                                        item.box.removeClass("loading");
                                        item.box.addClass("error");
                                    }
                                },
                                error: function (a, textError, c) {}
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown, aa) {
                        _this.files.forEach(function (item, key) {
                            item.box.find(".text").html("Ошибка загрузки");
                            item.box.removeClass("loading");
                            item.box.addClass("error");
                        });
                    }
                });
            });
            inputFile.val("");
        },
        prepareUpload: function (event, inputFile) {
            var _this = this;
            this.files = [];
            $.each(event.target.files, function (key, value) {
                inputFile
                    .parent()
                    .find(".form_fileList .list")
                    .append(
                        "<li class=\"item loading\"><span class=\"text\"></span> <span class=\"del\"></span></li>"
                    );
                _this.files.push({
                    id: key,
                    file: value,
                    box: inputFile.parent().find(".form_fileList .list li:last-child")
                });
            });
            this.uploadFiles(event, inputFile);
        },
        events: function () {
            var _this = this;
            // для всех файловых инпутов вешается обработчик на событие изменения
            $("input[type=file]").change(function (event) {
                _this.prepareUpload(event, $(this));
                $(".form_fileList .list").html();
            });
            // ну это клик удаления файла, должно быть
            $(document).on("click", ".form_fileList .list .item .del", function () {
                var num = $(this)
                    .parent()
                    .remove();
            });
        },
        init: function () {
            this.events();
        }
    },
    gallery: {
        length: 0,
        events: function () {
            this.eventsInited = true;
            var _ = this;

            $(document).on("click", "a[href=\"#photorama\"]", function () {
                _.length = 0;
                $(this)
                    .find(".data-imgs input")
                    .each(function () {
                        var itemMain;
                        var itemThumbs;
                        var lazyPreloader = "<div class=\"swiper-lazy-preloader\"></div>";
                        if ($(this).attr("poster")) {
                            var poster =
                                "<img data-src='" +
                                $(this).attr("poster") +
                                "' class='swiper-lazy'/>";
                            itemMain =
                                "<div class='swiper-slide video' data-iframe='" +
                                this.value +
                                "'>" +
                                poster +
                                lazyPreloader +
                                "</div>";
                            itemThumbs =
                                "<div class='swiper-slide video'>" +
                                poster +
                                lazyPreloader +
                                "</div>";
                        } else {
                            itemMain =
                                "<div class='swiper-slide'><div class='swiper-zoom-container'><img data-src='" +
                                this.value +
                                "' class='swiper-lazy'/></div>" +
                                lazyPreloader +
                                "</div>";
                            itemThumbs =
                                "<div class='swiper-slide'><img data-src='" +
                                this.value +
                                "' class='swiper-lazy' />" +
                                lazyPreloader +
                                "</div>";
                        }
                        $(".popup_item#photorama .photorama-thumbs .swiper-wrapper").append(
                            itemThumbs
                        );
                        $(".popup_item#photorama .photorama-main .swiper-wrapper").append(
                            itemMain
                        );
                        _.length++;
                    });

                if ($(this).attr("data-src")) {
                    var itemMain;
                    var itemThumbs;
                    var lazyPreloader = "<div class=\"swiper-lazy-preloader\"></div>";
                    itemMain =
                        "<div class='swiper-slide'><div class='swiper-zoom-container'><img data-src='" +
                        $(this).attr("data-src") +
                        "' class='swiper-lazy'/></div>" +
                        lazyPreloader +
                        "</div>";
                    itemThumbs =
                        "<div class='swiper-slide'><img data-src='" +
                        $(this).attr("data-src") +
                        "' class='swiper-lazy' />" +
                        lazyPreloader +
                        "</div>";
                    $(".popup_item#photorama .photorama-thumbs .swiper-wrapper").append(
                        itemThumbs
                    );
                    $(".popup_item#photorama .photorama-box").addClass("solo");
                    $(".popup_item#photorama .photorama-main .swiper-wrapper").append(
                        itemMain
                    );
                    _.length++;
                }
                _.createGallery();
            });
            $(document).on(
                "click",
                ".photorama-main .swiper-slide.video:not(.loaded)",
                function () {
                    var iframe = document.createElement("iframe");
                    iframe.style.width = $(this).width();
                    iframe.style.height = $(this).height();
                    iframe.setAttribute("allow", "autoplay");
                    iframe.setAttribute("frameborder", 0);
                    iframe.src = $(this).attr("data-iframe").replace("https://youtu.be/", "https://www.youtube.com/embed/") + "?autoplay=1";
                    $(this).addClass("loaded");
                    $(this).append(iframe);

                    /*var iframe = document.createElement("iframe");
                    iframe.name = "iframe";
                    iframe.style.width = $(this).width();
                    iframe.style.height = $(this).height();
                    iframe.setAttribute("frameborder", 0);
                    iframe.setAttribute("allowfullscreen", "");

                    $(this).addClass("loaded");
                    $(this).append(iframe);
                    iframe.src = $(this)
                        .attr("data-iframe")
                        .replace("watch?v=", "embed/");*/
                }
            );
            $(document).on("click", ".mobile_nav .left", function () {

                _.galleryBig.slidePrev();
                $(".mobile_nav .count").html(
                    _.galleryBig.realIndex + 1 + "/" + _.length
                );
            });
            $(document).on("click", ".mobile_nav .right", function () {
                _.galleryBig.slideNext();
                $(".mobile_nav .count").html(
                    _.galleryBig.realIndex + 1 + "/" + _.length
                );
            });
            var move_x = 0;
            var move_y = 0;
            $(document).on("mousedown", ".swiper-zoom-container", function (e) {
                move_x = e.clientX;
                move_y = e.clientY;
            });
            $(document).on("mouseup", function (e) {
                if (
                    Math.abs(move_x - e.clientX) <= 5 &&
                    Math.abs(move_y - e.clientY) <= 5
                ) {
                    if ($(window).width() > 768) {
                        var gesture = _.galleryBig.zoom.gesture;
                        gesture.$slideEl = _.galleryBig.slides.eq(_.galleryBig.activeIndex);
                        gesture.$imageEl = gesture.$slideEl.find(
                            "img, svg, canvas, picture, .swiper-zoom-target"
                        );
                        gesture.$imageWrapEl = gesture.$imageEl.parent(
                            ".swiper-zoom-container"
                        );
                        _.galleryBig.zoom.toggle();
                    }
                }
            });
        },
        clear: function () {
            var _ = this;
            $(".popup_item#photorama .photorama-box").removeClass("solo");
            if (_.galleryThumbs.destroy) {
                _.galleryThumbs.destroy();
                $(".photorama-thumbs .swiper-wrapper *").remove();
            }
            if (_.galleryBig.destroy) {
                _.galleryBig.destroy();
                $(".photorama-main .swiper-wrapper *").remove();
            }
        },
        createGallery: function () {
            var _ = this;
            // var countThumbs = 5;
            var countThumbs = 1;
            var solo = $(".popup_item#photorama .photorama-box").hasClass("solo");
            if ($(window).width() > 768) {
                //countThumbs = Math.round($(window).height() / 145);
            }
            _.galleryThumbs = new Swiper(".photorama-thumbs", {
                slidesPerView: countThumbs,
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 7
                },
                //speed: 500,
                speed: 1,
                //centeredSlides: true,
                virtualTranslate: true,
                //keyboard: {
                //	enabled: true,
                //	onlyInViewport: true,
                //  },
                direction: "vertical",
                slideToClickedSlide: true,
                mousewheel: {
                    forceToAxis: false,
                    sensitivity: 0.1
                },
            });

            _.galleryBig = new Swiper(".photorama-main", {

                effect: "slide",
                breakpoints: {
                    768: {
                        effect: "fade",
                    },
                },
                updateOnWindowResize: true,
                observer: true,
                fadeEffect: {
                    crossFade: true
                },
                zoom: {
                    containerClass: "swiper-zoom-container",
                    zoomedSlideClass: "zoomed",
                    toggle: $(window).width() <= 768
                },
                // thumbs: {
                //   swiper: _.galleryThumbs
                // },
                mousewheel: {
                    forceToAxis: false,
                    sensitivity: 0.1
                },
                //loop: !solo,
                slidesPerView: 1,
                lazy: true,
                //keyboard: {
                //	enabled: true,
                //	onlyInViewport: true,
                //  },
            });

            $(".swiper-container.photorama-main.swiper-container-initialized.swiper-container-horizontal").append( "<div class='swiper-big-befor'></div>" );
            $(".swiper-container.photorama-main.swiper-container-initialized.swiper-container-horizontal").prepend( "<div class='swiper-big-after'></div>" );
            $(".swiper-big-befor").on("click", function(){
                //$('.mobile_nav .str.left').trigger('click');
                var number = _.galleryThumbs.realIndex - 1;
                if(number >= 0)
                {
                    _.galleryBig.slideTo(number);
                    _.galleryThumbs.slideTo(number);
                }
            });
            $(".swiper-big-after").on("click", function(){
                //$('.mobile_nav .str.right').trigger('click');
                var number = _.galleryThumbs.realIndex + 1;
                if(number <= $(".photorama-main .swiper-slide").length-1)
                {
                    _.galleryBig.slideTo(number);
                    _.galleryThumbs.slideTo(number);
                }
            });


            _.galleryBig.on("click", function (e) {
                if($(window).width() <= 768)
                {
                    if($(".popup_full .photorama-main").hasClass("big"))
                    {
                        $(".popup_full .photorama-main").css({"height":"calc(100% - 72px)", "background-color": "neno"});
                        $(".popup_full .photorama-main").removeClass("big");
                    }
                    else
                    {
                        $(".popup_full .photorama-main").css({"height":"100%", "background-color": "#fff"});
                        $(".popup_full .photorama-main").addClass("big");
                    }
                }
            });

            //_.galleryThumbs.controller.control = _.galleryBig;
            //_.galleryBig.controller.control = _.galleryThumbs;

            if (_.length <= 1) {
                $(".mobile_nav").addClass("hide");
            } else {
                $(".mobile_nav").removeClass("hide");
            }

            var ThumbsHovered = false;
            $(".photorama-thumbs").hover(
                function () {
                    ThumbsHovered = true;
                },
                function () {
                    ThumbsHovered = false;
                }
            );
            $(".photorama-main").hover(function () {
                ThumbsHovered = false;
            });

            _.galleryThumbs.on("slideChange", function () {

                if($(".photorama-box").height() - (_.galleryThumbs.realIndex * _.galleryThumbs.height - (-1*(parseInt($(".swiper-wrapper").css("top"))))) < 0)
                {
                    var top = (parseInt($(".swiper-wrapper").css("top"))) - _.galleryThumbs.height;
                    $(".photorama-thumbs .swiper-wrapper").css("top", top);
                }
                else if(_.galleryThumbs.realIndex * _.galleryThumbs.height - (-1*(parseInt($(".swiper-wrapper").css("top")))) < 0)
                {
                    var top = (parseInt($(".swiper-wrapper").css("top"))) + _.galleryThumbs.height;
                    if(top > 0)
                        top = 0;
                    $(".photorama-thumbs .swiper-wrapper").css("top", top);
                }

                if (ThumbsHovered) {
                    _.galleryBig.slideTo(_.galleryThumbs.realIndex);
                }

                $(".mobile_nav .count").html(
                    _.galleryBig.realIndex + 1 + "/" + _.length
                );

                _.galleryThumbs.update();
                _.galleryBig.update();
            });

            _.galleryBig.on("slideChange", function () {
                if (!ThumbsHovered) {
                    _.galleryThumbs.slideTo(_.galleryBig.realIndex);
                }
                $(".mobile_nav .count").html(
                    _.galleryBig.realIndex + 1 + "/" + _.length
                );
                $(".photorama-main .swiper-slide.video").removeClass("loaded");
                $(".photorama-main .swiper-slide.video")
                    .find("iframe")
                    .remove();
                _.galleryThumbs.update();
                _.galleryBig.update();
            });

            $(".mobile_nav .count").html(1 + "/" + _.length);

            _.galleryBig.on("resize", function () {
                _.galleryBig.update();
                _.galleryThumbs.update();
            });
            $(window).on("resize", function () {
                _.galleryBig.update();
                _.galleryThumbs.update();
            });
            window.addEventListener(
                "orientationchange",
                function () {
                    _.galleryBig.update();
                    _.galleryThumbs.update();
                },
                false
            );
            if($(window).width() <= 768)
            {
                if($(".swiper-slide").length/2 == 1)
                {
                    $(".swiper-container.photorama-main.swiper-container-initialized").css("height","100%");
                }

                var scaling = false;
                var shownavigate = false;
                _.galleryBig.on(
                    "touchStart",
                    function (evt)
                    {
                        var tt = evt.targetTouches;
                        if (tt.length >= 2)
                        {
                            scaling = true;
                            if($(".popup_full .photorama-main").hasClass("big"))
                            {
                                shownavigate = false;
                                $(".popup_full .photorama-main").removeClass("big");
                            }
                            else
                            {
                                //$('.popup_full .photorama-main').css({'height':'100%', 'background-color': '#fff','margin-top':'-1px','padding-top':'1px'});
                                $(".popup_full .photorama-main").css({"background-color": "#fff"});
                                $(".popup_full .photorama-main").animate({
                                    height: "100%"
                                }, 500);
                                shownavigate = true;
                                $(".popup_full .photorama-main").addClass("big");
                            }
                        }
                    }
                );
                _.galleryBig.on(
                    "touchEnd",
                    function(evt)
                    {
                        if(scaling)
                        {
                            if($(".popup_full .photorama-main").hasClass("big"))
                            {
                                if(shownavigate)
                                {
                                    //$('.popup_full .photorama-main').css({'height':'calc(100% - 72px)', 'background-color': 'neno','margin-top':'0px','padding-top':'0px'});
                                    $(".popup_full .photorama-main").css({"background-color": "neno"});
                                    var heig = $(".popup_full .photorama-main").height()-72;
                                    $(".popup_full .photorama-main").animate({
                                        height: heig+"px"
                                    }, 500);
                                    $(".popup_full .photorama-main").removeClass("big");

                                }
                            }

                        }
                        scaling = false;
                    }
                );


            }


            $("#photorama").bind("mousewheel", function(e)
            {
                if(ThumbsHovered)
                {
                    var step = $(".photorama-thumbs .swiper-slide").height() + 1;
                    var countimage = $(".photorama-thumbs .swiper-slide").length;
                    var allheight = -1 * ((countimage * step) - $("#photorama").height()+0);
                    if(e.originalEvent.wheelDelta < 0)
                        step = -1 * step;
                    var oldtop = parseInt($(".photorama-thumbs .swiper-wrapper").css("top"));
                    var top =  oldtop + step;
                    if(top > 0)
                        top = 0;
                    else if (top < allheight)
                        top = allheight;
                    var numberimage = _.galleryBig.realIndex;
                    if(oldtop > top)
                    {
                        var numberel = (parseInt(top / step)) + 7;
                        _.galleryThumbs.lazy.loadInSlide(numberel);
                        numberimage = numberimage + 1;
                        if(numberimage > countimage)
                            numberimage = countimage;
                    }
                    else if(oldtop < top)
                    {
                        numberimage = numberimage - 1;
                        if(numberimage < 0)
                            numberimage = 0;
                    }

                    _.galleryBig.slideTo(numberimage);
                    _.galleryThumbs.slideTo(numberimage);

                    $(".photorama-thumbs .swiper-wrapper").css("top", top);
                }
            });

            $(document).keyup(function (e) {
                var countimage = $(".photorama-thumbs .swiper-slide").length;
                var numberimage = _.galleryBig.realIndex;

                if(e.which == 38 || e.which == 37)
                {
                    numberimage--;
                }
                else if(e.which == 39 || e.which == 40)
                {
                    numberimage++;
                }

                if(countimage >= numberimage && numberimage >= 0 && numberimage!=_.galleryBig.realIndex)
                {
                    _.galleryThumbs.lazy.loadInSlide(numberimage);
                    _.galleryBig.lazy.loadInSlide(numberimage);
                    _.galleryBig.slideTo(numberimage);
                    _.galleryThumbs.slideTo(numberimage);
                }
            });

        },
        init: function () {
            var _ = this;
            if (!this.eventsInited) _.events();
        }
    },
    body: {
        scroll: function () {
            //$(".wrapper").perfectScrollbar({ suppressScrollX: true });
            //$('.wrapper').css('height','100vh')
        },
        events: function () {
            var cutTop = $(document).scrollTop();
            $(document).on("scroll", function (e) {
                // вот то самое место, которое предотвращает скроллинг страницы и возвращает его в исходную позицию cutTop. Интересно.
                if ($("body").hasClass("scrollDis")) {
                    e.preventDefault();
                    $(document).scrollTop(cutTop);
                } else {
                    cutTop = $(document).scrollTop();
                }
            });
        },
        init: function () {
            this.scroll();
            this.events();
        }
    },
    errorMess: {
        offsetWords: 20,
        copyText: function () {
            var div = document.createElement("div");
            div.appendChild(
                window
                    .getSelection()
                    .getRangeAt(0)
                    .cloneContents()
            );
            var selectionText = div.innerText.replace(new RegExp("\\r?\\n", "g"), "");

            var allTextInBlock = window.getSelection().anchorNode.parentElement;
            var allTextInBlockText = allTextInBlock.innerText;
            posLeft = 0;
            var pos = allTextInBlockText.indexOf(selectionText);

            function findstr() {
                allTextInBlock = allTextInBlock.parentElement;
                allTextInBlockText = allTextInBlock.innerText;
                pos = allTextInBlockText.indexOf(selectionText);
            }
            //findstr();
            if (pos > this.offsetWords) {
                posLeft = pos - this.offsetWords;
            }
            posRight = pos + selectionText.length;

            var leftText = allTextInBlockText.substr(posLeft, pos - posLeft);
            var rightText = allTextInBlockText.substr(posRight, this.offsetWords);

            $("#messError .popup_textError").html(
                leftText + "<span>" + selectionText + "</span>" + rightText
            );
            var url = document.location.href;
            $("#messError")
                .find("[name=error]")
                .val(selectionText);
            $("#messError")
                .find("[name=place]")
                .val(allTextInBlockText);
            $("#messError")
                .find("[name=url]")
                .val(url);
        },
        popupOpen: function () {
            this.copyText();
            this.parent.popup.open("#messError", "inWindow");
        },
        messing: function () {
            var _this = this;
            // отправка и последующее открытие окна с информацией
            // какая-то форма, не понимаю какая
            $(document).on("submit", "#messError form", function (e) {
                e.preventDefault();
                _this.parent.popup.open("#messError_succes", "inWindow");
            });
        },
        events: function () {
            var _this = this;
            var ctrlPress = false;
            $(window).keydown(function (event) {
                if (event.keyCode == 17 || event.keyCode == 91) {
                    ctrlPress = true;
                }
            });
            $(window).keyup(function (event) {
                if (event.keyCode == 17 || event.keyCode == 91) {
                    ctrlPress = false;
                }
            });
            $(window).keydown(function (event) {
                if (event.keyCode == 13 && ctrlPress) {
                    _this.popupOpen();
                }
            });
        },
        init: function () {
            this.events();
            this.messing();
        }
    },
    init: function () {
        this.popup.parent = this;
        this.errorMess.parent = this;
        this.header.init();
        this.footer.init();
        this.popup.init();
        this.form.init();
        this.gallery.init();
        this.body.init();
        this.errorMess.init();
    }
};
pages = {
    main: {
        slider: {
            boxClass: "fpSlider",
            labelsClass: "fpSlider_labels",
            bgs: null,
            texts: null,
            videos: null,
            setVideos: function () {
                this.videos = $("." + this.boxClass).find("video");
            },
            // используется в событиях свайпера - смена слайдов, инициализация
            startCurrentVideo: function (type) {
                var _this = this;
                // число слайдов, за исключением свайпер-дубликатов
                var count = $(document).find(".fpSlider .swiper-slide:not(.swiper-slide-duplicate)").length;

                // если номер активного слайда менее или равен натуральному числу слайдов, то берет номер активного, иначе просто единица.
                var slide_id = _this.bgs.activeIndex <= count ? _this.bgs.activeIndex : 1;
                
                if (this.videos.length > 0) {
                    var i = 0;
                    // проходимся по всем видео циклом.
                    this.videos.each(function () {
                        // инициализация - нужно выполнить загрузку только первого видео
                        if (type == "init") {
                            // тут просто - нулевой индекс в массиве слайдов.
                            if (i == 0) {
                                this.src = $(this).attr("data-src");
                                // вот эти приколы с автоплеем нужны, чтобы видос начал проигрываться только когда анимация перехода завершится.
                                this.autoplay = true;
                            }
                        }
                        // здесь видимо имеется в виду загрузка только видео из текущего слайда. должно применяться при смене слайда?
                        if (type == "start") {
                            if (i == slide_id) {
                                this.src = $(this).attr("data-src");
                                this.autoplay = false;
                            }
                        }
                        if (type == "end") {
                            if (i == slide_id) {
                                // должно быть, по умолчанию автоплей - ложь, и устанавливается в истину только здесь
                                this.autoplay = true;
                                // определяется, играет ли уже видео. если нет, то запускается методом объекта видео
                                var isPlaying = this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2;
                                if (!isPlaying) {
                                    console.log(this);
                                    this.play();
                                }
                            } else {
                                this.src = "";
                                this.oncanplay = null;
                            }
                        }
                        i++;
                    });
                }
                _this.setAutoplay(slide_id);
            },
            sliderCreate: function () {
                if ($("." + this.boxClass).length > 0) {
                    this.bgs = new Swiper("." + this.boxClass, {
                        loop: true,
                        speed: 500,
                        init: false,
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
                    });
                    this.texts = new Swiper("." + this.labelsClass, {
                        touchRatio: 0.2,
                        slideToClickedSlide: true,
                        loop: true,
                        speed: 500,
                        effect: "coverflow",
                        coverflowEffect: {
                            rotate: 0,
                            slideShadows: true
                        },
                        breakpoints: {
                            651: {
                                speed: 1300
                            }
                        }
                    });
                    // связь слайдеров
                    this.bgs.controller.control = this.texts;

                    this.texts.controller.control = this.bgs;
                    var _this = this;

                    // 
                    this.bgs.on("init", function () {
                        _this.startCurrentVideo("init");
                        _this.bgs.lazy.loadInSlide(0);
                    });
                    // 
                    slideVideoDo = function () {
                        _this.startCurrentVideo();
                    };
                    this.bgs.init();

                    this.bgs.on("slideChangeTransitionStart", function () {
                        // выполнит ленивую загрузку видео в активном слайде
                        _this.startCurrentVideo("start");
                    });
                    this.bgs.on("slideChangeTransitionEnd", function () {
                        // выполняется каждый раз, когда заканчивается анимация смены слайда
                        _this.startCurrentVideo("end");
                    });
                }
            },
            setAutoplay: function (id) {
                var _this = this;
                var defaultTime = false;
                var index = id - 1;

                this.timeStart = new Date();

                // находит в документе среди оригинальных слайдов слайд с подходящим индексом
                var slide = $(document)
                    .find(".fpSlider .swiper-slide:not(.swiper-slide-duplicate)")
                    .eq(index); 
                
                if (slide.find("video").length > 0) {
                    // форматированная длительность видео
                    defaultTime = slide.find("video").eq(0)[0].duration * 1000;

                    if (!defaultTime) {
                        defaultTime = 9000;
                        // если в слайде присутствует видео (???)
                        if (slide.find("video").length > 0) {
                            
                            // событие  canplay происходит, когда браузер готов проигрывать видео
                            slide.find("video").eq(0)[0].oncanplay = function () {
                                // разница между текущим моментом и сохраненным при запуске функции
                                var timeLoad = new Date() - _this.timeStart;
                                // если таймлоад достаточно мал
                                if (timeLoad < 9000) {

                                    clearTimeout(_this.timeOutAutoPlay);
                                    
                                    // вычисляем значение для длительности видео
                                    var timeDuration = this.duration * 1000 - timeLoad;

                                    // установка длительности анимации для буллета
                                    $(".fpSlider_wrapper .swiper-pagination-bullet")
                                        .eq(index)
                                        .css("animation-duration", timeDuration + "ms");

                                    // место, где перелистывается слайд. по окончанию видео слайдер листается дальше.
                                    _this.timeOutAutoPlay = setTimeout(function () {
                                        _this.bgs.slideNext();
                                    }, timeDuration);

                                    this.oncanplay = null;
                                }
                            };
                        }
                    }
                } else {
                    // если у нас не обнаружилось ни одного видео в слайдере, мы берем дефолтное значение.
                    defaultTime = 9000;
                }
                clearTimeout(_this.timeOutAutoPlay);

                // установка длительности анимации для буллета
                $(".fpSlider_wrapper .swiper-pagination-bullet")
                    .eq(index)
                    .css("animation-duration", defaultTime + "ms");

                // место, где перелистывается слайд. теперь уже только дефолтные значения без допольнительных вычислений
                _this.timeOutAutoPlay = setTimeout(function () {
                    _this.bgs.slideNext();
                    if (slide.find("video").length > 0)
                        slide.find("video").eq(0)[0].oncanplay = null;
                }, defaultTime);

            },
            // любопытно - он устанавливает мобилньные картинки по соотношению ширины и высоты экрана
            mobileImgSetSize: function () {
                $(".fpSlider_item_bg .img-mobile").each(function () {
                    // real size of image
                    var nwidth = this.naturalWidth;
                    var nheight = this.naturalHeight;

                    var k = nwidth / nheight;
                    // класс width устанавливает для изображений самые банальные стили - ширина 100, высота авто.
                    if ($(this).height() * k < $(window).width()) {
                        $(this).addClass("width");
                    }
                    if ($(this).width() / k < $(window).height()) {
                        $(this).removeClass("width");
                    }
                });
            },
            init: function () {
                this.videos = $("." + this.boxClass).find("video"); // обнаруживает все видео
                this.mobileImgSetSize();
                this.sliderCreate();
                this.setVideos(); // просто запись переменной this.videos
                var _this = this;
                $(window).on("resize", function () {
                    _this.mobileImgSetSize();
                });
            }
        },
        sound: {
            audioMuted: true,
            inProcess: false,
            loaded: false,
            // просто назначает обработчик клика по элементу
            muteInit: function () {
                var _this = this;
                // click handler
                $(".fpSlider_mute").click(function () {
                    if (!_this.inProcess) {
                        $(this).toggleClass("active");
                        _this.audioMuted = $(this).hasClass("active");
                        if (_this.audioMuted) {
                            // сменить текст, запустить звук
                            $(this).text($(this).attr("data-word-on"));
                            _this.lazySart();
                        } else {
                            $(this).text($(this).attr("data-word-off"));
                            _this.lazyStop();
                        }
                    }
                });
            },
            lazySart: function () {
                var _this = this;
                this.inProcess = true;
                var audio = $("audio").eq(0)[0]; // элемент аудио
                audio.volume = 0;
                var play = function () {
                    audio.play();
                    _this.loaded = true;
                    var intrvl = setInterval(function () {
                        audio.volume += 0.01;
                        if (audio.volume >= 0.9) {
                            clearInterval(intrvl);
                            audio.volume = 1;
                            _this.inProcess = false;
                        }
                    }, 10);
                };
                if (!this.loaded) {
                    audio.load();
                    audio.oncanplay = play;
                } else {
                    play();
                }
            },
            lazyStop: function () {
                var _this = this;
                this.inProcess = true;
                var audio = $("audio").eq(0)[0];

                var intrvl = setInterval(function () {
                    audio.volume -= 0.01;
                    if (audio.volume <= 0.1) {
                        clearInterval(intrvl);
                        audio.pause();
                        audio.volume = 0;
                        _this.inProcess = false;
                    }
                }, 10);
            },
            init: function () {
                var _ = this;
                var audio = $("audio").eq(0)[0];
                if ($(window).width() > 1024)
                    $("audio").load(audio.getAttribute("data-src"), function () {
                        _.muteInit();
                    });
            }
        },
        init: function () {
            if (
                $(window).width() <= 650 || ($(window).width() <= 950 && $(window).height() <= 450)
            ) {
                // видео и аудио удаляется из дом на маленьком экране
                $(".fpSlider")
                    .find("video")
                    .remove();
                $(".fpSlider_wrapper")
                    .find("audio")
                    .remove();
            } else {
                // путь к видео вставляется в атрибут
                $(".fpSlider_wrapper")
                    .find("audio")
                    .eq(0)
                    .attr(
                        "src",
                        $(".fpSlider_wrapper")
                            .find("audio")
                            .eq(0)
                            .attr("data-src")
                    );
                // $(".fpSlider")
                //   .find("video")
                //   .each(function() {
                //     $(this).attr("src", $(this).attr("data-src"));
                //   });
            }
            if (inited) this.slider.init();
            //this.slider.init();
            if ($("audio").length > 0) this.sound.init();
        }
    },
    projects: {
        items: null,
        basicDelay: 400,
        index: 0,
        loaded: false,
        intrvl: [],
        // я так понимаю, что эта штука служит для определения цвета какого-то фона. видимо это лоадер.
        // прикол в том, что вызов этой дряни для проектов не совершается
        bgSet: function () {
            this.items.each(function () {
                var container = this.querySelector(".projects_item_loadBg");
                var img = this.querySelector(".projects_item_img");
                $.ajax({
                    url: "colorCalc.php",
                    type: "POST",
                    data: {
                        src: $(img).attr("data-src")
                    },
                    success: function (rgb) {
                        $(container).css("background", rgb);
                    }
                });
            });
        },
        // а вызов этой штуки тоже закоментировано
        showImg: function () {
            this.index = 0;
            _this = this;
            var y = 0;
            var stack = 0;
            var stackSizeMax = $(window).width() > 768 ? 2 : 1;
            this.items.each(function () {
                var $this = $(this);
                if (
                    $(document).scrollTop() + $(window).height() >
                    $(this).offset().top
                ) {
                    if (!_this.intrvl[y]) {
                        stack++;
                        _this.intrvl[y] = setTimeout(function () {
                            if ($this.hasClass("is-hidden")) {
                                _this.imageLoad($this);
                            }
                        }, _this.index * _this.basicDelay);
                    }
                    if ($this.hasClass("is-hidden") && stack == stackSizeMax) {
                        stack = 0;
                        _this.index++;
                    }
                }
                y++;
            });
        },
        // служит как минимум для анимированного показа картинок в широких карточках
        imageLoad: function ($this) {
            var $img = $this.find(".projects_item_img").eq(0);
            var img = $this.find(".projects_item_img").eq(0)[0];
            
            $this.removeClass("is-hidden");
            $this.addClass("is-proccess");
            $this.append("<span class='loadMonitor show'></span>");
            
            if (img.hasAttribute("data-src")) {
                // используется событие загрузки элемента картинки
                img.onload = function (e) {
                    $this.addClass("is-loaded");
                    $this.find(".loadMonitor").removeClass("show");
                    setTimeout(function () {
                        $this.removeClass("is-proccess");
                        $this.find(".loadMonitor").remove();
                    }, 500);
                };
                img.src = img.getAttribute("data-src");
                img.setAttribute("data-src", "");
            }
        },
        loadImg: {
            checkPos: function () {
                var _ = this;
                // находит картинки по классу
                var imgs = document.getElementsByClassName("projects_item_img");
                // варварское отношение к переменным...
                var imgs = Array.prototype.slice.call(imgs, 0);
                var scroll = window.pageYOffset;
                var height = window.innerHeight;

                imgs.forEach(function (item, key) {
                    var parent = item.parentNode;
                    // определили отступ контейнера картинки до верха
                    var top = parent.offsetTop;
                    if (scroll + height > top) {
                        if (parent.classList.contains("is-hidden")) {
                            _.loadingImg(item);
                        }
                    }
                });
            },
            beforeloadImg: function (img) {
                var parent = img.parentNode;
                parent.classList.remove("is-hidden");
                parent.classList.add("is-proccess");
                var span = document.createElement("span");
                span.classList.add("loadMonitor");
                span.classList.add("show");
                parent.appendChild(span);
                var tempid = parseInt((Math.random() + 1) * 5000);
                img.id = "to-loader-" + tempid;
                return tempid;
            },
            // этот метод по сути должен просто проставлять атрибут src
            loadingImg: function (img) {
                var _ = this;
                var tempId = _.beforeloadImg(img);
                var wait = setTimeout(function () {
                    img.onload = function () {
                        console.log("повтор");
                        _.afterLoadImg(img);
                    };
                    img.src = img.getAttribute("data-src");

                }, 1000);
                // эта штучка скорее всего не работает совсем
                var bLazy = new Blazy({
                    selector: "#to-loader-" + tempId,
                    success: function (element) {
                        clearTimeout(wait);
                        var loader = this;
                        _.afterLoadImg(element),
                        setTimeout(function () {
                            //loader.destroy();
                        }, 500);
                    },
                    error: function () {
                        console.log("error");
                    }
                });
            },
            afterLoadImg: function (img) {
                var parent = img.parentNode;
                parent.classList.add("is-loaded");
                var loadmonitor = parent.querySelectorAll(".loadMonitor")[0];
                loadmonitor.classList.remove("show");
                setTimeout(function () {
                    parent.classList.remove("is-proccess");
                    loadmonitor.remove();
                }, 500);
            },
            init: function () {
                var _ = this;
                this.checkPos();
                $(document).on("scroll", function () {
                    _.checkPos();
                });
            }
        },
        events: function () {
            _this = this;
            this.eventsInited = true;
        },
        init: function () {
            this.items = $(document).find(".projects_item");
            this.intrvl = [];
            this.index = 0;
            if (!this.eventsInited) this.events();
            // используется в этом блоке вместо showImg 
            this.loadImg.init();
        }
    },
    projectsDetail: {
        fpProject: {
            loaderBg: null,
            fpImg: null,
            bgSet: function () {
                var _this = this;
                $.ajax({
                    url: "colorCalc.php",
                    type: "POST",
                    data: {
                        src: this.fpImg.attr("data-src")
                    },
                    success: function (rgb) {
                        _this.loaderBg.css("background", rgb);
                    }
                });
            },
            showImg: function () {
                if (this.fpImg.parent().hasClass("is-hidden")) {
                    this.imageLoad();
                }
            },
            imageLoad: function () {
                this.fpImg.parent().removeClass("is-hidden");
                this.fpImg.load(
                    this.fpImg.attr("data-src"),
                    //callback
                    function () {
                        $(this).attr("src", $(this).attr("data-src"));
                        $(this)
                            .parent()
                            .addClass("is-loaded");
                        var $this = $(this);
                    }
                );
            },
            init: function () {
                this.loaderBg = $(".fpProject_loader");
                this.fpImg = $(".fpProject_content img");
                this.bgSet();
                this.showImg();
            }
        },
        fpPhoto: {
            elems: null,
            events: function () {
                var _this = this;
                $(document).on("scroll", function () {
                    if (_this.elems.length > 0)
                        _this.elems.each(function () {
                            if (!$(this).hasClass("open")) {
                                if (
                                    $(document).scrollTop() + 20 >
                                    $(this).offset().top - $(window).height()
                                ) {
                                    _this.show($(this));
                                }
                            }
                        });
                });
                $(document).on("click", ".fpPhoto_box", function () {
                    $(this)
                        .parent()
                        .find(".js-popup")
                        .click();
                });
            },
            show: function (item) {
                item.closest(".fpPhoto_box").addClass("open");
            },
            init: function () {
                this.elems = $(".fpPhoto img");
                if (!window.inited)
                    this.events();
            }
        },
        // я так понимаю, что эта функция при скролле проверяет позицию и назначает элементам класс, который обеспечит эффект fadeUp
        scrollAnim: {
            items: null,
            fadeUp: function (item) {
                item.addClass("animed");
            },
            checkPos: function () {
                var _this = this;
                this.items.each(function () {
                    if (
                        $(document).scrollTop() >
                        $(this).offset().top - $(window).height()
                    ) {
                        _this.anim($(this));
                    }
                });
            },
            events: function () {
                var _this = this;
                $(document).on("scroll", function () {
                    _this.checkPos();
                });
            },
            anim: function (item) {
                if (!item.hasClass("animed")) {
                    this.fadeUp(item);
                }
            },
            init: function () {
                this.items = $(document).find(".scrollanim,.scrollanimChild >*");
                this.events();
                this.checkPos();
            }
        },
        adaptiveslider: {
            item: null,
            width: 600,
            create: function () {
                if ($(window).width() <= this.width) {
                    this.item.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        speed: 1000,
                        infinite: false,
                        dots: true,
                        arrows: false
                    });
                }
            },
            events: function () {
                var _this = this;
                $(window).on("resize", function () {
                    _this.create();
                });
                _this.create();
            },
            init: function () {
                this.item = $(".sItems_list");
                this.events();
            }
        },
        infSlider: {
            box: null,
            buts: null,
            bar: null,
            animate: false,
            create: function () {
                this.box.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 600,
                    infinite: false,
                    swipe: false,
                    dots: false,
                    arrows: false
                });
                var i = 0;
                this.buts.each(function () {
                    $(this).attr("slide-id", i), i++;
                });
            },
            moveBar: function (ofsetLeft, width) {
                this.bar.css("left", ofsetLeft);
                this.bar.css("width", width + 40);
            },
            events: function () {
                var _this = this;
                this.buts.click(function () {
                    if (_this.buts.length > 1)
                        if (!$(this).hasClass("active") && !_this.animate) {
                            _this.buts.removeClass("active");
                            $(".infSlider_select").removeClass("active");
                            $(this).addClass("active");
                            _this.animate = true;
                            _this.box.slick("slickGoTo", $(this).attr("slide-id"));
                            _this.moveBar(
                                $(this).offset().left -
                                $(this)
                                    .parent()
                                    .offset().left,
                                $(this).width()
                            );
                        } else if ($(window).width() <= 768) {
                            if (!$(".infSlider_select").hasClass("active")) {
                                $(".infSlider_select").addClass("active");
                            } else {
                                $(".infSlider_select").removeClass("active");
                            }
                        }
                    if (_this.buts.length <= 1) {
                        $(".infSlider_select").addClass("soloItem");
                    } else {
                        $(".infSlider_select").removeClass("soloItem");
                    }
                });
                $(window).on("resize", function () {
                    var item = $(".infSlider_menu_item.active");
                    if (item.length > 0)
                        _this.moveBar(
                            item.offset().left - item.parent().offset().left,
                            item.width()
                        );
                });
                this.box.on("afterChange", function () {
                    _this.animate = false;
                });
                this.moveBar(
                    _this.buts.eq(0).offset().left -
                    _this.buts
                        .eq(0)
                        .parent()
                        .offset().left,
                    _this.buts.eq(0).width()
                );
            },
            init: function () {
                this.box = $(".infSlider_list");
                this.buts = $(".infSlider_menu_item");
                if (this.buts.length <= 1) {
                    $(".infSlider_select").addClass("soloItem");
                }
                this.bar = $(".infSlider_bar");
                this.create();
                this.events();
            }
        },
        btnBack: {
            but: null,
            events: function () {
                // this.but.click(function(e) {
                //   e.preventDefault();
                //   history.back();
                // });
            },
            init: function () {
                this.but = $("#back_page");
                this.events();
            }
        },
        yaMapCreate: {
            center: null,
            createPlaceMark: function (coords, src, sity, name, link) {
                var width = 400;
                var wordToProject = "Перейти к проекту";
                if (location.href.indexOf("/en/") != -1) {
                    wordToProject = "Open the Project";
                }
                if ($(window).width() <= 600) width = 320;
                return new ymaps.Placemark(
                    coords, {
                        balloonContentHeader: "<div class=\"yaMap_head\">" +
                            "<img src=\"" +
                            src +
                            "\" class=\"\" height=\"174\" width=\"" +
                            width +
                            "\"/>" +
                            "</div>",
                        balloonContentBody: "<div class=\"yaMap_content\">" +
                            "<p>" +
                            sity +
                            "</p>" +
                            "<h3>" +
                            name +
                            "</h3>" +
                            "<a href=\"" +
                            link +
                            "\" class=\"default-btn btn-gray\">" +
                            wordToProject +
                            "<a>" +
                            "</div>",
                        maxHeight: $(window).width() < 600 ? 174 : 260,
                        balloonContentFooter: "",
                        hintContent: "<span class=hintContent-title>" +
                            name +
                            "</span>" +
                            "<span class=hintContent-text>" +
                            sity +
                            "</span>"
                    }, {
                        hideIconOnBalloonOpen: false,
                        iconLayout: "default#image",
                        iconImageHref: "/local/templates/main/images/loc.svg",
                        iconImageSize: [40, 40],
                        iconImageOffset: [-20, -20]
                    }
                );
            },
            create: function () {
                var _this = this;
                myMap = new ymaps.Map(
                    "map", {
                        center: _this.center,
                        zoom: 16,
                        type: "yandex#satellite",
                        controls: []
                    }, {
                        searchControlProvider: "yandex#search"
                    }
                );
                myMap.events.add("click", function () {
                    myMap.balloon.close();
                });

                myMap.behaviors.disable("scrollZoom");
                if ($(".map_data .placeMark").length > 0) {
                    $(".map_data .placeMark").each(function () {
                        myMap.geoObjects.add(
                            _this.createPlaceMark(
                                $(this)
                                    .attr("data-cords")
                                    .split(","),
                                $(this).attr("data-img"),
                                $(this).attr("data-sity"),
                                $(this).attr("data-name"),
                                $(this).attr("data-link")
                            )
                        );
                    });
                }
                var zoomControl = new ymaps.control.ZoomControl({
                    options: {
                        size: "auto",
                        float: "none",
                        position: {
                            right: 10,
                            bottom: 40
                        }
                    }
                });
                if ($("#map").hasClass("hasBalloon"))
                    myMap.geoObjects.options.set({
                        hasBalloon: false
                    });
                if ($(window).width() < 768) {

                    myMap.behaviors.disable("drag");
                }
                myMap.controls.add(zoomControl);
            },
            create_full: function () {
                var _this = this;
                if ($(window).width() < 600) {
                    var zoom = $("#map").hasClass("hasBalloon") ? 13 : 2;
                }else{
                    var zoom = $("#map").hasClass("hasBalloon") ? 13 : 4;
                }
                myMapFull = new ymaps.Map(
                    "map", {
                        center: location.pathname === "/projects/geography/"? [54.654,70.714] :[55.76, 59.64],//_this.center,//
                        zoom: zoom,
                        controls: []
                    }, {
                        searchControlProvider: "yandex#search"
                    }
                );
                clusterer = new ymaps.Clusterer({
                    preset: "islands#invertedVioletClusterIcons",
                    clusterIcons: [{
                        href: "/local/templates/main/images/map_claster.svg",
                        size: [50, 50],
                        offset: [-25, -25]
                    }],
                    groupByCoordinates: false,
                    clusterIconColor: "black",
                    clusterHideIconOnBalloonOpen: false,
                    geoObjectHideIconOnBalloonOpen: false
                });
                clusterer.options.set({
                    gridSize: 80
                });
                myMapFull.events.add("click", function () {
                    myMapFull.balloon.close();
                });
                myMapFull.behaviors.disable("scrollZoom");
                if ($(".map_data .placeMark").length > 0) {
                    $(".map_data .placeMark").each(function () {
                        clusterer.add(
                            _this.createPlaceMark(
                                $(this)
                                    .attr("data-cords")
                                    .split(","),
                                $(this).attr("data-img"),
                                $(this).attr("data-sity"),
                                $(this).attr("data-name"),
                                $(this).attr("data-link")
                            )
                        );
                    });
                }
                myMapFull.geoObjects.add(clusterer);
                myMapFull.geoObjects.events
                    .add("balloonopen", function (e) {
                        if ($(window).width() <= 600) e.get("target").balloon.close();
                    })
                    .add("click", function (e) {
                        if ($(window).width() <= 600 && !$("#map").hasClass("hasBalloon")) {
                            var props = e.get("target").properties;
                            var head = props.get("balloonContentHeader");
                            var body = props.get("balloonContentBody");
                            if (head) {
                                $("#ym_baloon")
                                    .find(".ym_baloon_content")
                                    .html(head + body);
                                templs.popup.open("#ym_baloon");
                            }
                        }
                    });
                $(document).on("click", "#ym_baloon .ym_baloon_content a", function () {
                    templs.popup.close();
                });
                var zoomControl = new ymaps.control.ZoomControl({
                    options: {
                        size: "auto",
                        float: "none",
                        position: {
                            right: 10,
                            bottom: 40
                        }
                    }
                });
                if ($("#map").hasClass("hasBalloon"))
                    myMapFull.geoObjects.options.set({
                        hasBalloon: false
                    });
                if ($(window).width() < 768) {
                    myMapFull.behaviors.disable("drag");
                }
                myMapFull.controls.add(zoomControl);
            },
            init: function () {
                var _this = this;
                this.center =
                    $(".map_data .placeMark").length > 0 ?
                        $(".map_data .placeMark")
                            .eq(0)
                            .attr("data-cords")
                            .split(",") : [57.446132, 55.233856];

                function initMap() {
                    if ($("#map").hasClass("full")) {
                        _this.create_full();
                    } else {
                        _this.create();
                    }
                }
                ymaps.ready(function () {
                    initMap();
                });
            }
        },
        init: function () {
            if ($(".fpProject").length > 0) this.fpProject.init();
            this.fpPhoto.init();
            if ($(".scrollanim,.scrollanimChild").length > 0) this.scrollAnim.init();
            if ($("#map").length > 0) this.yaMapCreate.init();
            if ($(".sItems").length > 0) this.adaptiveslider.init();
            if ($(".infSlider").length > 0) this.infSlider.init();
            if ($("#back_page").length > 0) this.btnBack.init();
            if ($(window).width() <= 650) {
                $(".fpProject_video video").remove();
            }
        }
    },
    servicesDetail: {
        slider: null,
        create: function () {
            // проверить деталку услуги - по каким-то причинам тут такое странное условие - то свайпер, то слик
            if (this.slider.hasClass("swiper-container")) {
                var BItemsSwiper = new Swiper(".bItems_list.slider", {
                    speed: 700,
                    slidesPerView: 1,
                    spaceBetween: 20,
                    pagination: {
                        el: ".bItems_list-dots.swiper-pagination",
                        type: "bullets",
                        clickable: true
                    },
                    breakpoints: {
                        768: {
                            slidesPerView: 2,
                            speed: 1200
                        }
                    }
                });
            } else
                this.slider.slick({
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    speed: 1200,
                    cssEase: "ease-in-out",
                    infinite: false,
                    dots: true,
                    arrows: false,
                    responsive: [{
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1
                        }
                    }]
                });
        },
        init: function () {
            this.slider = $(".bItems_list.slider");
            this.create();
        }
    },
    company: {
        dropDown: function (item) {
            if ($(window).width() <= 950) {
                if (item.hasClass("open")) {
                    item.attr("style", "");
                    item.removeClass("open");
                } else {
                    item.addClass("open");
                    item.height(item.find(".inner").height());
                }
            }
        },
        dropDownVacancy: function (item) {
            if (item.hasClass("open")) {
                item.height(
                    item.find(".vacancy_title").height() +
                    item
                        .find(".vacancy_title")
                        .css("padding-top")
                        .replace("px", "") *
                    2 +
                    2
                );
                item.removeClass("open");
            } else {
                item.addClass("open");
                item.height(item.find(".vacancy_item_inner").height() + 30);
            }
        },
        setVacancy: function (item) {
            item.height(
                item.find(".vacancy_title").height() +
                item
                    .find(".vacancy_title")
                    .css("padding-top")
                    .replace("px", "") *
                2 +
                2
            );
        },
        dropDownPrize: function (item) {
            if ($(window).width() <= 600) {
                if (item.hasClass("open")) {
                    item.height(item.attr("data-height"));
                    item.removeClass("open");
                } else {
                    if (!item.attr("data-height")) {
                        item.attr("data-height", item.height());
                        item.find(".prizes_text,.prizes_img").addClass("pos");
                        item.height(item.attr("data-height"));
                    }
                    item.addClass("open");
                    item.height(item.find(".prizes_item").height());
                }
            }
        },
        events: function () {
            var _this = this;
            $(".rowBox_row").click(function () {
                _this.dropDown($(this));
            });
            $(".prizes_item_wrapper").click(function () {
                _this.dropDownPrize($(this));
            });
            $(".vacancy_item").click(function () {
                _this.dropDownVacancy($(this));
            });
            if ($(".vacancy_item").length > 0)
                $(".vacancy_item").each(function () {
                    _this.setVacancy($(this));
                });
        },
        init: function () {
            this.events();
        }
    },
    contacts: {
        validate: function () {
            $("#contacts_form").parsley();
        },
        init: function () {
            if ($("#contacts_form")) {
                this.validate();
            }
        }
    },
    newDetail: {
        events: function () {
            var _this = this;
            $(".boxHide_but").click(function (e) {
                e.preventDefault();
                $(this)
                    .parent()
                    .toggleClass("active");
            });
            $(document).on("click", ".comment_item > .default-btn", function (e) {
                e.preventDefault();
                if (
                    $(this)
                        .parent()
                        .find(">.form").length == 0
                ) {
                    $(".comment")
                        .find(".parsley-required")
                        .remove();
                    $(".comment")
                        .find("*")
                        .removeClass("parsley-error");
                    var answerId = $(this)
                        .parent()
                        .attr("data-answer-id");
                    $(".comment")
                        .find(".form")
                        .find("[name=\"abswer_id\"]")
                        .remove();
                    $(".comment")
                        .find(".form")
                        .append(
                            "<input name=\"abswer_id\" type=\"hidden\" value=\"" + answerId + "\"/>"
                        );
                    var html = $(".comment")
                        .find(".form")
                        .eq(0)[0].outerHTML;
                    $(".comment")
                        .find(".form")
                        .remove();
                    $(html).css("margin-bottom", 0);
                    $(this)[0].outerHTML = $(this)[0].outerHTML + html;
                    _this.validate();

                    if ($(".comment").find(".simpleCommentBut").length == 0) {
                        $(".comment_title:last-child").html(
                            "<a href=\"\" class=\"default-btn btn-gray simpleCommentBut\">Оставить коментарий</a>"
                        );
                    }
                }
            });
            $(document).on("click", ".simpleCommentBut", function (e) {
                e.preventDefault();
                $(".comment_title:last-child").html("Оставить коментарий");
                $(".comment")
                    .find(".parsley-required")
                    .remove();
                $(".comment")
                    .find("*")
                    .removeClass("parsley-error");
                var html = $(".comment")
                    .find(".form")
                    .eq(0)[0].outerHTML;
                $(".comment")
                    .find(".form")
                    .remove();
                $(html).attr("style", "");
                $(".comment_title:last-child").eq(0)[0].outerHTML =
                    $(".comment_title:last-child").eq(0)[0].outerHTML + html;
                _this.validate();
            });
        },
        sliderInit: function () {
            $(".new_list.slider").slick({
                slidesToShow: 2,
                slidesToScroll: 1,
                speed: 1200,
                cssEase: "ease-in-out",
                infinite: false,
                dots: true,
                arrows: false,
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 2000,
                    settings: {
                        slidesToShow: 2
                    }
                }
                ]
            });
        },
        validate: function () {
            $("#comment_form").parsley();
        },
        init: function () {
            this.events();
            if ($(".new_list.slider")) {
                //this.sliderInit();
            }
            if ($("#comment_form")) {
                this.validate();
            }
        }
    },
    init: function () {
        this.main.init();
        if ($(".projects")) this.projects.init();
        this.projectsDetail.init();
        this.servicesDetail.init();
        this.company.init();
        this.contacts.init();
        this.newDetail.init();
    }
};
XHRequests = {
    store: [],
    currentPage_id: 0,
    offsetPage: 0,
    preloader: false,
    // метод для запросов
    newRequest: function (href, succes, failed) {
        // при каждом использовании этого метода показывается прелоадер
        this.showPreloader();
        this.preloader = true;

        if (window.XMLHttpRequest) {
            // firefox etc
            this.XHR = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // ie
            this.XHR = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var _this = this;
        //this.XHR.responseType = "document";
        this.XHR.onload = function () {
            handleResponse(_this.XHR);
        };
        this.XHR.open("POST", href, true);

        function handleResponse(request) {
            setTimeout(function () {
                var elem_ = document.getElementsByClassName("iframeDoc");
                if (elem_.length > 4) {
                    elem_[0].parentNode.removeChild(elem_[0]);
                }

                if (request.status == 200 || request.status == 404) {
                    succes();
                    var temp_html = request.response;
                    _this.reloadPageDoing(temp_html);

                    _this.XHR.onload = null;
                } else {
                    failed();
                }
            }, 500);
        }

        this.XHR.onerror = function (e) {
            failed();
            _this.XHR.onerror = null;
        };
        this.XHR.send();
    },
    newPage: function (href, target, e) {
        succes = function () {
            if (this.offsetPage < 0) {
                this.store.splice(
                    this.currentPage_id + 1,
                    this.store.length - 1 - this.currentPage_id
                );
            }
            var lastStore = this.store[this.store.length - 1];
            var next_id = lastStore ? lastStore.id + 1 : 0;
            var pageInf = {
                id: next_id,
                href: href
            };
            this.store.push(pageInf);
            history.pushState(pageInf, null, href);
            this.currentPage_id = next_id;
        }.bind(this);
        failed = function () {
            target.attr("data-fail-xhr", "fail");
            target[0].click();
        }.bind(this);
        this.newRequest(href, succes, failed);
    },
    backPage: function (href) {
        this.currentPage_id--;
        this.offsetPage--;
        succes = function () {}.bind(this);
        failed = function () {}.bind(this);

        this.newRequest(href, succes, failed);
    },
    nextPage: function (href) {
        this.currentPage_id++;
        this.offsetPage++;
        succes = function () {}.bind(this);
        failed = function () {}.bind(this);
        this.newRequest(href, succes, failed);
    },
    // набор событий, связанных с асинхронностью
    events: function () {
        var _this = this;
        // клик по ссылкам, расположенным внутри враппера
        $(document).on("click", ".wrapper a", function (e) {
            var href = $(this).attr("href");
            // куча проверок
            if (
                href[0] != "#" && // не заглушка
                href.indexOf("tel:") != 0 && // исключаем телефон
                href.indexOf("mailto:") != 0 && // исключаем письмо
                href.indexOf("callto:") != 0 && // исключаем звонок
                href.indexOf("skype:") != 0 && // исключаем скайп
                href != "" && // исключаем пустую ссылку
                !$(this).is("[download]") && // исключаем ссылку на скачивание файла
                (!$(this).attr("target") || $(this).attr("target") != "_blank") // исключаем ссылки с открытием другого окна
            ) {
                if ($(this).attr("data-fail-xhr") == undefined) {
                    if (
                        getInternetExplorerVersion() !== -1 &&
                        ($(this).hasClass("footer_lang") ||
                            $(this).hasClass("fpSlider_botContent_but") ||
                            $(this)
                                .parent()
                                .hasClass("language"))
                    ) {} else {
                        e.preventDefault();
                        if (href.indexOf("#") != -1) href = href.split("#")[0];
                        _this.newPage(href, $(this), e);
                        if ($(this).hasClass("header_mobileMenu_lang_title")) {
                            templs.header.burger.close();
                        }
                    }
                }
            }
        });
        // это событие изменения активной записи истории 
        window.addEventListener("popstate", function (e) {
            // по некому идентификатору в свойстве определяется, совершается ли переход на следующую либо предыдущую страницу
            if (e.state) {
                if (e.state.id < _this.currentPage_id) {
                    _this.backPage(e.state.href);
                } else if (e.state.id > _this.currentPage_id) {
                    _this.nextPage(e.state.href);
                }
            }
        });
    },
    pullState: function () {
        if (history.length == 2) {
            href = document.location.href;
            var pageInf = {
                id: 0,
                href: href
            };
            this.store.push(pageInf);
            history.replaceState(pageInf, null, href);
        } else {
            for (var i = 0; i < history.length - 1; i++) {
                this.store.push({
                    id: i,
                    url: null
                });
            }
        }
    },
    showPreloader: function () {
        var _this = this; // сохраняем контекст для функции animate
        var loader = "<div class=\"bgLoadPage color\"><div class=\"loadMonitor\"></div></div>";
        var color = $(".header").hasClass("scrolled") ? "white" : "black";
        
        loader = loader.replace("color", color);
        
        $(".wrapper").append(loader);

        $(".wrapper")
            .find(".bgLoadPage")
            .animate(
                {
                    opacity: 1
                },
                500,
                function () {
                    _this.preloader = false;
                }
            );
    },
    hidePreloader: function () {
        var _this = this;
        func = function () {
            $(".wrapper")
                .find(".bgLoadPage")
                .addClass("loaded");

            setTimeout(function () {
                $(".wrapper")
                    .find(".bgLoadPage")
                    .animate({
                        opacity: 0
                    },
                    500,
                    function () {
                        $(".wrapper")
                            .find(".bgLoadPage")
                            .remove();
                    }
                    );
            }, 300);
        };
        if (_this.preloader) {
            var wait = setInterval(function () {
                if (!_this.preloader) {
                    func();
                    clearInterval(wait);
                }
            }, 50);
        } else func();
    },
    subDocument: function (string) {
        var _iframe = document.createElement("iframe");
        _iframe.style.display = "none";
        _iframe.className = "iframeDoc";
        document.body.appendChild(_iframe);
        var head = string.slice(
            string.indexOf("<head>") + 6,
            string.indexOf("</head>")
        );
        var body = string.slice(
            string.indexOf("<body>") + 6,
            string.indexOf("</body>")
        );
        _iframe.contentDocument.body.innerHTML = body;
        _iframe.contentDocument.head.innerHTML = head;
        return _iframe;
    },
    reloadPageDoing: function (temp_html) {
        var _this = this;
        var iframe = this.subDocument(temp_html);
        var __html = iframe.contentDocument;

        var loadedIframe = function (_html, iframe_) {
            var replaceDOM = function (_class, _parent) {
                var _old = document.getElementsByClassName(_class)[0];
                var _new = _html.getElementsByClassName(_class)[0];
                if (!_old) {
                    _parent.append(_new);
                } else {
                    _parent.replaceChild(_new, _old);
                }
            };
            var wrapper = document.getElementsByClassName("wrapper")[0];
            var newWrapper = _html.getElementsByClassName("wrapper")[0];
            replaceDOM("page", wrapper);
            replaceDOM("header", wrapper);
            replaceDOM("footer", wrapper);
            var hh = location.href.split("?")[1] == "test=1" || window.debugger;

            if (!hh) {
                function getArray(selector, parent) {
                    return Array.prototype.slice.call(parent.querySelectorAll(selector));
                }
                getArray("title,meta,[type=\"image/png\"]", document.head).forEach(
                    function (elem) {
                        if (elem.remove) elem.remove();
                    }
                );
                getArray("*", _html.head).forEach(function (elem) {
                    var find = false;
                    getArray("*", document.head).forEach(function (elem2) {
                        if (elem2.outerHTML == elem.outerHTML) find = true;
                    });
                    if (!find && elem.tagName) document.head.appendChild(elem);
                });
            } else {
                document.documentElement.replaceChild(_html.head, document.head);

            }

            wrapper.classList.remove("only-fp");
            if (newWrapper.classList.contains("only-fp"))
                wrapper.classList.add("only-fp");
            /* for (var i = 0; i < newWrapper.classList.length; i++) {
              wrapper.classList.add(newWrapper.classList[i]);
            } */
            if (window.location.hash.length > 0) {
                window.hashName = window.location.hash;
                scrollToHash =
                    $(window.hashName).offset().top -
                    $(window).height() / 2 -
                    $(window.hashName).height() / 2;
            } else {
                scrollToHash = 0;
            }

            function doo() {
                templs.init();
                pages.init();
                _this.hidePreloader();
                $(document).scrollTop(scrollToHash);
                if (hh) iframe_.remove();
            }
            if (document.readyState === "complete") {
                doo();
            } else {
                window.onload = function () {
                    ymaps.ready(function () {
                        doo();
                    });
                    window.onload = null;
                };
            }
            $("body").removeClass("scrollDis");
        };

        if (iframe.contentWindow.document.readyState == "complete") {
            loadedIframe(__html, iframe);
        } else {
            iframe.onload = function () {
                loadedIframe(__html, iframe);
            };
        }
    },
    init: function () {
        this.XHR = new XMLHttpRequest();
        this.pullState();
        this.events();
        //if (!inited) this.hidePreloader();
    }
};

// обработка отправки формы комментов, наверное
$(document).on("submit", "#comment_form ", function (e) {
    e.preventDefault();
    var _ = this;
    $.ajax({
        url: $(_).attr("action"),
        type: "POST", //метод отправки
        dataType: "html", //формат данных
        data: $(_).serialize(),
        success: function (data) {
            //Данные отправлены успешно
            templs.popup.open("#comment_succes", "inWindow");
        },
        error: function (response) {
            alert("Ошибка данных");
        }
    });
});

// по событию загрузки документа мы прячем прелоадер
$(window).on("load", function () {
    XHRequests.hidePreloader();
});

// тоже для скрытия прелоадера в разных ситуациях
if (document.readyState === "complete") {
    XHRequests.hidePreloader();
} else {
    window.onload = function () {
        ymaps.ready(function () {
            XHRequests.hidePreloader();
        });
        window.onload = null;
    };
}

function getInternetExplorerVersion() {
    var rv = -1;
    if (navigator.appName == "Microsoft Internet Explorer") {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
    } else if (navigator.appName == "Netscape") {
        var ua = navigator.userAgent;
        var re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
    }
    return rv;
}
// import "./import/swiper-bundle.min.js";
// import "./import/modules";
// import "./import/components";
import footerAccordeon from "%modules%/footer/footer";
import header from "%modules%/header/header";

// index slider

// gallery call

// compose - mobile slider

// gallery

// infoslider, mobile - accordeon. Dynamic width indicator

// items slider

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
            console.log(head);
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

// press one - toggle social

// popup

// animation on load blocks - intersection observer

// forms - validation, file uploads

header();
historyAccordeon();
footerAccordeon();
shareToggle();

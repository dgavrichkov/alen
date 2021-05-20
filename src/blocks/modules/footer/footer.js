const footerItemAccordeon = () => {
    const triggers = document.querySelectorAll(".footer__title");
    triggers.forEach(trg => {
        trg.addEventListener("click", function() {
            trg.parentElement.classList.toggle("is-active");
        });
    });

};

export default footerItemAccordeon;
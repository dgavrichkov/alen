const footerItemAccordeon = () => {
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

export default footerItemAccordeon;
import cardHtml from "./Card.html";
import styles from "./Card.scss";

function Card(wrapper, currency, ratioGetter, headerText) {

    console.log("wrapper", wrapper, currency, ratioGetter);
    
    function setCardToWrapper () {
        wrapper.innerHTML = cardHtml;
    }

    function setHeader() {
        wrapper.querySelector(".card-header").textContent = headerText;
    }

    function setItemToDpdBtn() {
        let item = wrapper.querySelector(`[data-currency=${currency}]`).closest(".dropdown__item");
        wrapper.querySelector(".dropdown__country").innerHTML = item.innerHTML;
    }

    setCardToWrapper();

    setHeader();

    setItemToDpdBtn();

}

export { Card };
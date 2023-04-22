import { currencies } from "../data/currencies";
import { calculateRates } from "../data/rates";
import { getRatio, getReverseRatio } from "../data/rates";
import card from "./Card.html";
import { composeLabelText } from "../helpers";

function Card(wrapper, currency, ratioGetter, headerText) {

    console.log("wrapper", wrapper, currency, ratioGetter);
    
    function setCardToWrapper () {
        wrapper.innerHTML = card;
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
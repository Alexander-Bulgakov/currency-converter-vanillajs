import cardHtml from "./Card.html";
import styles from "./Card.scss";

function Card(wrapper, currency, headerText) {
  function setCardToWrapper() {
    wrapper.innerHTML = cardHtml;
  }

  function setHeaderText() {
    wrapper.querySelector(".card-header").textContent = headerText;
  }

  function setItemToDpdBtn() {
    let item = wrapper
      .querySelector(`[data-currency=${currency}]`)
      .closest(".dropdown__item");
    wrapper.querySelector(".dropdown__country").innerHTML = item.innerHTML;
  }

  setCardToWrapper();

  setHeaderText();

  setItemToDpdBtn();
}

export { Card };

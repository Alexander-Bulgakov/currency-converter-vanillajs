// import card from "../components/Card.html";
import styles from "./converterPage.scss";
import converterHtml from "./converterPage.html";
import { currencies } from "../../data/currencies";
import { rotateArrow, composeLabelText } from "../../helpers";
import { getRatio, getReverseRatio, calculateRates } from "../../data/rates";
import { SELL_CARD_HEADER, BUY_CARD_HEADER } from "../../constants";
import { Card } from "../../components/Card";

function ConverterPage() {
  document.querySelector("#root").innerHTML = converterHtml;

  /**
   * initial layout
   */

  // положить компонент Card в две обертки
  const sellCard = document.querySelector("#sell-card");
  const buyCard = document.querySelector("#buy-card");

  Card(sellCard, currencies.sellCurrency, SELL_CARD_HEADER);
  Card(buyCard, currencies.buyCurrency, BUY_CARD_HEADER);

  const $ = {
    dropDowns: [...document.querySelectorAll(".dropdown")],
    inputs: [...document.querySelectorAll(".currency__input")],
    dropDownBts: [...document.querySelectorAll(".dropdown__button")],
    arrows: [...document.querySelectorAll(".arrow")],
    dropdownContents: [...document.querySelectorAll(".dropdown__content")],
    sellItems: [...sellCard.querySelectorAll(".dropdown__item")],
    buyItems: [...buyCard.querySelectorAll(".dropdown__item")],
  };

  composeLabelText();

  /**
   * inputs event listeners
   */

  // Разрешить вводить в инпут только цифры
  $.inputs.forEach((input, index) => {
    input.addEventListener("input", function (event) {
      const reg = /[0-9]/g;
      this.value = reg.test(event.data) ? this.value : this.value.slice(0, -1);
      if (index === 0) {
        $.inputs[1].value = this.value
          ? (this.value * getRatio()).toFixed(2)
          : "";
      } else {
        $.inputs[0].value = this.value
          ? (this.value * getReverseRatio()).toFixed(2)
          : "";
      }
    });
  });

  function cleanInputs() {
    $.inputs.forEach((input) => (input.value = ""));
  }

  /**
   * Dropdown event listeners
   */

  // Клик по дропдауну, раскрыть/закрыть список, развернуть стрелку
  $.dropDownBts.forEach((item) => {
    item.addEventListener("click", function () {
      const arrow = this.querySelector(".arrow");
      rotateArrow(arrow);
      const dropDownContent =
        this.closest(".dropdown").querySelector(".dropdown__content");
      dropDownContent.classList.toggle("dropdown__content_active");
    });
  });

  /**
   * dropdown items event listeners
   */

  const inactiveItems = {
    sellItem: null,
    buyItem: null,
  };

  const setInactiveItems = (itemsChanges = false) => {
    if (itemsChanges) {
      inactiveItems.sellItem.classList.remove("inactive-item");
      inactiveItems.buyItem.classList.remove("inactive-item");
    }

    inactiveItems.sellItem = $.sellItems.find((item) => {
      return (
        item.querySelector(".dropdown__currency").dataset.currency ===
        currencies.buyCurrency
      );
    });
    inactiveItems.buyItem = $.buyItems.find((item) => {
      return (
        item.querySelector(".dropdown__currency").dataset.currency ===
        currencies.sellCurrency
      );
    });

    inactiveItems.sellItem.classList.add("inactive-item");
    inactiveItems.buyItem.classList.add("inactive-item");
  };
  setInactiveItems();

  // Выбор элемента списка. Переложить выбранное значение в скрытый инпут, закрыть селект
  [...$.sellItems, ...$.buyItems].forEach((item) => {
    item.addEventListener("click", function () {
      const dropDown = this.closest(".dropdown");
      dropDown.querySelector(".dropdown__country").innerHTML = this.innerHTML;
      $.dropdownContents.forEach((item) => {
        item.classList.remove("dropdown__content_active");
      });
      $.arrows.forEach((arrow) => rotateArrow(arrow, true));

      // изменить валюты покупки и продажи
      if (dropDown.closest("#sell-card")) {
        currencies.sellCurrency = this.querySelector(
          ".dropdown__currency"
        ).dataset.currency;
      } else {
        currencies.buyCurrency = this.querySelector(
          ".dropdown__currency"
        ).dataset.currency;
      }

      composeLabelText();
      setInactiveItems(true);
      calculateRates(currencies.sellCurrency, currencies.buyCurrency);
      cleanInputs();
    });
  });

  /**
   * document event listeners
   */

  // reverse currencies
  document.querySelector(".reverse").addEventListener("click", function () {
    currencies.reverseCurrencies();
    composeLabelText();
    let sellCountry = sellCard.querySelector(".dropdown__country");
    let sellItem = $.sellItems.find(
      (item) =>
        item.querySelector(".dropdown__currency").dataset.currency ===
        currencies.sellCurrency
    );
    sellCountry.innerHTML = sellItem.innerHTML;
    let buyCountry = buyCard.querySelector(".dropdown__country");
    let buyItem = $.buyItems.find(
      (item) =>
        item.querySelector(".dropdown__currency").dataset.currency ===
        currencies.buyCurrency
    );
    buyCountry.innerHTML = buyItem.innerHTML;

    setInactiveItems(true);
    calculateRates(currencies.sellCurrency, currencies.buyCurrency);
    cleanInputs();
  });

  // Клик снаружи дропдауна. Закрыть дропдаун, перевернуть стрелку
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) {
      $.arrows.forEach((arrow) => {
        rotateArrow(arrow, true);
      });
      $.dropDowns.forEach((item) => {
        item
          .querySelector(".dropdown__content")
          .classList.remove("dropdown__content_active");
      });
    }
  });

  // Нажатие на Tab или Escape. Закрыть дропдаун, перевернуть стрелку
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" || event.key === "Escape") {
      $.arrows.forEach((arrow) => {
        rotateArrow(arrow, true);
        $.dropDowns.forEach((item) => {
          item
            .querySelector(".dropdown__content")
            .classList.remove("dropdown__content_active");
        });
      });
      $.dropdownContents.forEach((item) => {
        item.classList.remove("dropdown__content_active");
      });
    }
  });
}

export { ConverterPage };

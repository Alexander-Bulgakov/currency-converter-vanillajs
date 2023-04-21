import card from "../components/Card.html";
import converter from "./converter.html";
import { currencies } from "../data/currencies";
import { rotateArrow } from "../helpers";
import { getRatio, getReverseRatio, calculateRates } from "../data/rates";
import { SELL_CARD_HEADER, BUY_CARD_HEADER } from "../constants";

function Converter() {

  /**
   * initial layout
   */

  document.querySelector("#root").innerHTML = converter;
  const sellCard = document.querySelector("#sell-card");
  const buyCard = document.querySelector("#buy-card");
  
  // положить компонент Card в две обертки, вставить текст хедэра
  const setCardsToWrappers = () => {
    sellCard.innerHTML = card;
    sellCard.querySelector(".card-header").textContent = SELL_CARD_HEADER;
    buyCard.innerHTML = card;
    buyCard.querySelector(".card-header").textContent = BUY_CARD_HEADER;
  }
  
  setCardsToWrappers();

  // положить в дропдауны items, соответствующие исходным валютам для конвертации
  let buyItem = buyCard.querySelector(`[data-currency=${currencies.buyCurrency}]`).closest(".dropdown__item");
  buyCard.querySelector(".dropdown__country").innerHTML = buyItem.innerHTML;

  let sellItem = sellCard.querySelector(`[data-currency=${currencies.sellCurrency}]`).closest(".dropdown__item");
  sellCard.querySelector(".dropdown__country").innerHTML = sellItem.innerHTML;

  // заполнить input label
  const sellLabel = sellCard.querySelector(".currency__label");
  const buyLabel = buyCard.querySelector(".currency__label");

  const composeLabelText = async () => {
    await calculateRates(currencies.sellCurrency, currencies.buyCurrency);
    sellLabel.textContent = `1 ${currencies.sellCurrency} = ${getRatio().toFixed(4)} ${currencies.buyCurrency}`;
    buyLabel.textContent = `1 ${currencies.buyCurrency} = ${getReverseRatio().toFixed(4)} ${currencies.sellCurrency}`;
  }

  composeLabelText();

  /**
   * input event listeners
   */

  // Разрешаем вводить в инпут только цифры
  const currencyAmountInputs = document.querySelectorAll(".currency__input");
  const inputs = Array.from(currencyAmountInputs);
  inputs.forEach((input, index) => {
    input.addEventListener("input", function (event) {
      const reg = /[0-9]/g;
      this.value = (reg.test(event.data)) ? this.value : this.value.slice(0, -1);
      if (index === 0) {
        inputs[1].value = (this.value) ? (this.value * getRatio()).toFixed(2) : "";
      } else {
        inputs[0].value = (this.value) ? (this.value * getReverseRatio()).toFixed(2) : "";
      }
    });
  });

  /**
   * Dropdown event listeners
   */

  const dropdownContents = document.querySelectorAll(".dropdown__content");
  const currentBtn = document.querySelector(".dropdown__button");
  const dropDownBts = document.querySelectorAll(".dropdown__button");
  let arrows = document.querySelectorAll(".arrow");

  // Клик по дропдауну, раскрыть/закрыть список, развернуть стрелку
  [...dropDownBts].forEach(item => {
    item.addEventListener("click", function () {
      const arrow = this.querySelector(".arrow");
      rotateArrow(arrow);
      const dropDownContent = this.closest(".dropdown").querySelector(".dropdown__content");
      dropDownContent.classList.toggle("dropdown__content_active");
    })
  });

  /**
   * dropdown items event listeners
   */

  const dropDownItems = document.querySelectorAll(".dropdown__item");

  const sellItems = [...dropDownItems].filter(item => item.closest("#sell-card"));
  const buyItems = [...dropDownItems].filter(item => item.closest("#buy-card"));

  const inactiveItems = {
    sellItem: null,
    buyItem: null,
  }

  const setInactiveItems = (itemsChanges = false) => {
    if (itemsChanges) {
      inactiveItems.sellItem.classList.remove("inactive-item");
      inactiveItems.buyItem.classList.remove("inactive-item");
    }

    inactiveItems.sellItem = sellItems.find(item => {
      return item.querySelector(".dropdown__currency").dataset.currency === currencies.buyCurrency;
    });
    inactiveItems.buyItem = buyItems.find(item => {
      return item.querySelector(".dropdown__currency").dataset.currency === currencies.sellCurrency;
    });

    inactiveItems.sellItem.classList.add("inactive-item");
    inactiveItems.buyItem.classList.add("inactive-item");
  }
  setInactiveItems();

  // Выбор элемента списка. Переложить выбранное значение в скрытый инпут, закрыть селект
  [...dropDownItems].forEach(item => {
    item.addEventListener("click", function () {
      const dropDown = this.closest(".dropdown");
      dropDown.querySelector(".dropdown__country").innerHTML = this.innerHTML;
      dropdownContents.forEach(item => {
        item.classList.remove("dropdown__content_active");
      });
      [...arrows].forEach(arrow => rotateArrow(arrow, true))

      // изменить валюты покупки и продажи
      if (dropDown.closest("#sell-card")) {
        currencies.sellCurrency = this.querySelector(".dropdown__currency").dataset.currency;
      } else {
        currencies.buyCurrency = this.querySelector(".dropdown__currency").dataset.currency;
      }
      composeLabelText();
      setInactiveItems(true);
      calculateRates(currencies.sellCurrency, currencies.buyCurrency);
      // calcRates();

      // очистить инпуты
      inputs.forEach(input => input.value = "");
    })
  });

  /**
   * reverse currencies
   */

  document.querySelector(".reverse").addEventListener("click", function () {
    currencies.reverseCurrencies();
    composeLabelText();
    let sellCountry = sellCard.querySelector(".dropdown__country");
    let sellItem = sellItems.find(item => item.querySelector(".dropdown__currency").dataset.currency === currencies.sellCurrency);
    sellCountry.innerHTML = sellItem.innerHTML;
    let buyCountry = buyCard.querySelector(".dropdown__country");
    let buyItem = buyItems.find(item => item.querySelector(".dropdown__currency").dataset.currency === currencies.buyCurrency);
    buyCountry.innerHTML = buyItem.innerHTML;

    //очистить инпуты
    inputs.forEach(input => input.value = "");
    setInactiveItems(true);
    calculateRates(currencies.sellCurrency, currencies.buyCurrency);
    // calcRates();
  })

  /**
   * document event listeners
   */

  // Клик снаружи дропдауна. Закрыть дропдаун, перевернуть стрелку
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) {
      [...arrows].forEach(arrow => {
        rotateArrow(arrow, true);
        document.querySelectorAll(".dropdown").forEach(item => {
          item.querySelector(".dropdown__content").classList.remove("dropdown__content_active");
        });
      })
    }
  });

  // Нажатие на Tab или Escape. Закрыть дропдаун, перевернуть стрелку
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" || event.key === "Escape") {
      let arrows = document.querySelectorAll(".arrow");
      [...arrows].forEach(arrow => {
        rotateArrow(arrow, true);
        document.querySelectorAll(".dropdown").forEach(item => {
          item.querySelector(".dropdown__content").classList.remove("dropdown__content_active");
        });
      });
      dropdownContents.forEach(item => {
        item.classList.remove("dropdown__content_active");
      })
      currentBtn.classList.remove("button-active");
    }
  });
}

export { Converter };
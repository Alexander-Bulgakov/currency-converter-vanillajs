import styles from "./styles/index.scss";
import image from "./images/cat.png";
import handleLocation from "./router.js";
import card from "./components/Card.html";
import { calculateRates, rotateArrow } from "./helpers";

document.querySelector(".navbar__image img").src = image;

handleLocation();

/**
 * initial layout
 */

let sellCurrency = "RUB";
let buyCurrency = "USD";

const sellCard = document.querySelector("#sell-card");
const buyCard = document.querySelector("#buy-card");

// положить компонент Card в две обертки
const setCardsToWrappers = () => {
  sellCard.innerHTML = card;
  buyCard.innerHTML = card;
}
setCardsToWrappers();

// положить в дропдауны items, соответствующие исходным валютам для конвертации
let buyItem = buyCard.querySelector(`[data-currency=${buyCurrency}]`).closest(".dropdown__item");
buyCard.querySelector(".dropdown__country").innerHTML = buyItem.innerHTML;

let sellItem = sellCard.querySelector(`[data-currency=${sellCurrency}]`).closest(".dropdown__item");
sellCard.querySelector(".dropdown__country").innerHTML = sellItem.innerHTML;

/**
 * fetching data
 */

const sellLabel = sellCard.querySelector(".currency__label");
const buyLabel = buyCard.querySelector(".currency__label");

// Рассчитать и вывести в интерфейс курсы валют

let ratio, reverseRatio;

const calcRates = async () => {
  ratio = await calculateRates(sellCurrency, buyCurrency);
  reverseRatio = 1 / ratio;
}

const composeLabelText = async () => {
  await calcRates();
  sellLabel.textContent = `1 ${sellCurrency} = ${ratio.toFixed(4)} ${buyCurrency}`;
  buyLabel.textContent = `1 ${buyCurrency} = ${reverseRatio.toFixed(4)} ${sellCurrency}`;
}

composeLabelText();

/**
 * input event listeners
 */

// Разрешаем вводить в инпут только цифры
const currencyAmountInputs = document.querySelectorAll(".currency__input");
const inputs = Array.from(currencyAmountInputs);
inputs.forEach((input, index) => {
  input.addEventListener("input", function(event) {
    const reg = /[0-9]/g;
    this.value = ( reg.test(event.data) ) ? this.value : this.value.slice(0,-1);
    if (index === 0) {
      inputs[1].value = (this.value) ? (this.value * ratio).toFixed(2) : "";
    } else {
      inputs[0].value = (this.value) ? (this.value * reverseRatio).toFixed(2) : "";
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
  item.addEventListener("click", function() {
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
    return item.querySelector(".dropdown__currency").dataset.currency === buyCurrency;
  });
  inactiveItems.buyItem  = buyItems.find(item => {
    return item.querySelector(".dropdown__currency").dataset.currency === sellCurrency;
  });

  inactiveItems.sellItem.classList.add("inactive-item");
  inactiveItems.buyItem.classList.add("inactive-item");
}
setInactiveItems();

// Выбор элемента списка. Переложить выбранное значение в скрытый инпут, закрыть селект
[...dropDownItems].forEach(item => {
  item.addEventListener("click", function() {
    const dropDown = this.closest(".dropdown");
    dropDown.querySelector(".dropdown__country").innerHTML = this.innerHTML;
    dropdownContents.forEach( item => {
      item.classList.remove("dropdown__content_active");
    });  
    [...arrows].forEach(arrow => rotateArrow(arrow, true))
    
    // изменить валюты покупки и продажи
    if (dropDown.closest("#sell-card")) {
      sellCurrency = this.querySelector(".dropdown__currency").dataset.currency;
    } else {
      buyCurrency = this.querySelector(".dropdown__currency").dataset.currency;
    }  
    composeLabelText();
    setInactiveItems(true);

    // очистить инпуты
    inputs.forEach(input => input.value = "");
  })  
});

/**
 * reverse currencies
 */

document.querySelector(".reverse").addEventListener("click", function(){
  [sellCurrency, buyCurrency] = [buyCurrency, sellCurrency];
  composeLabelText();
  let sellCountry = sellCard.querySelector(".dropdown__country");
  let sellItem = sellItems.find(item => item.querySelector(".dropdown__currency").dataset.currency === sellCurrency);
  sellCountry.innerHTML = sellItem.innerHTML;
  let buyCountry = buyCard.querySelector(".dropdown__country");
  let buyItem = buyItems.find(item => item.querySelector(".dropdown__currency").dataset.currency === buyCurrency);
  buyCountry.innerHTML = buyItem.innerHTML;

  //очистить инпуты
  inputs.forEach(input => input.value = "");
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
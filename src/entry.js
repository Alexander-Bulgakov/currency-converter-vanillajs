import styles from "./styles/index.scss";
import image from "./images/cat.png";
import getData from "./data.js";
import handleLocation from "./router.js";
import card from "./components/Card.html";

document.querySelector(".navbar__image img").src = image;

handleLocation();

/**
 * initial layout
 */

let sellCurrency = "RUB";
let buyCurrency = "USD";

// положить компонент Card в две обертки
const sellCard = document.querySelector("#sell-card");
sellCard.innerHTML = card;
const buyCard = document.querySelector("#buy-card");
buyCard.innerHTML = card;

// положить в дропдауны items, соответствующие исходным валютам для конвертации
let buyCountry = buyCard.querySelector(`[data-currency=${buyCurrency}]`);
let buyItem = buyCountry.closest(".dropdown__item");
buyCard.querySelector(".dropdown__country").innerHTML = buyItem.innerHTML;

/**
 * fetching data
 */

let rates = {};
// const sellLabel = document.querySelector("#sell-currency-label");
const sellLabel = sellCard.querySelector(".currency__label");
// const buyLabel = document.querySelector("#buy-currency-label");
const buyLabel = buyCard.querySelector(".currency__label");

// Рассчитать и вывести в интерфейс курсы валют

let ratio, reverseRatio;

const composeLabelText = (ratio) => {
  reverseRatio = 1 / ratio;
  sellLabel.textContent = `1 ${sellCurrency} = ${ratio.toFixed(4)} ${buyCurrency}`;
  buyLabel.textContent = `1 ${buyCurrency} = ${reverseRatio.toFixed(4)} ${sellCurrency}`;
}

const calculateRates = async () => {
  rates = await getData();

  if (sellCurrency !== "RUB" && buyCurrency !== "RUB") {
    ratio = rates[sellCurrency] / rates[buyCurrency];
  } else if (buyCurrency === "RUB") {
    ratio = rates[sellCurrency];
  } else if (sellCurrency === "RUB" && buyCurrency !== "RUB") {
    ratio = 1 / rates[buyCurrency];
  }
  composeLabelText(ratio);
}
calculateRates();

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
    arrow.classList.toggle("arrow-up");
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
    const arrow = dropDown.querySelector(".arrow");
    arrow.classList.toggle("arrow-up");
    
    // изменить валюты покупки и продажи
    if (dropDown.closest("#sell-card")) {
      sellCurrency = this.querySelector(".dropdown__currency").dataset.currency;
    } else {
      buyCurrency = this.querySelector(".dropdown__currency").dataset.currency;
    }  
    calculateRates();
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
  calculateRates();
  // let sellCard = document.querySelector("#sell-card");
  // let buyCard = document.querySelector("#buy-card");
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
      arrow.classList.remove("arrow-up");
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
    [...arrows].forEach(element => {
      element.classList.remove("arrow-up");
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
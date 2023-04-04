import converter from "./pages/converter.html";
import ratioPage from "./pages/ratio.html";
import notFound from "./pages/404.html";
import styles from "./styles/index.scss";
import image from "./images/cat.png";

// var myHeaders = new Headers();
// myHeaders.append("apikey", "xXPtOAgX9pvC2AB4ZBKZvsBkVhAS1s5Z");

// var requestOptions = {
//   method: "GET",
//   redirect: "follow",
//   headers: myHeaders,
// };

// var dataJSON = fetch(
//   "https://api.apilayer.com/exchangerates_data/symbols",
//   requestOptions
// )
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.log("error", error));
// // const APIKey = "xXPtOAgX9pvC2AB4ZBKZvsBkVhAS1s5Z";
// fs.writeFile("file.json", dataJSON, function () {
//   console.log("Error!");
// });

document.querySelector(".navbar__image img").src = image;

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  console.log(event.target.href);
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  "/": converter,
  "/converter": converter,
  "/ratio": ratioPage,
  404: notFound,
};

const handleLocation = () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  document.querySelector("#root").innerHTML = route;
  // } else {
  //   document.querySelector("#root").innerHTML = notFound;
  // }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

let sellCurrency = "RUB";
let buyCurrency = "USD";

/**
 * fetching data
 */

const rates = {};

const sellLabel = document.querySelector("#sell-currency-label");
const buyLabel = document.querySelector("#buy-currency-label");
const sellHiddenInput = document.querySelector("#sell-hidden-input");
const buyHiddenInput = document.querySelector("#buy-hidden-input");

async function getCurrencies() {
  const responce = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
  const json = await responce.json();
  rates.USD = json.Valute.USD.Value;
  rates.EUR = json.Valute.EUR.Value;
  rates.GBP = json.Valute.GBP.Value;
  rates.JPY = json.Valute.JPY.Value;
  setLabelContent();
}
getCurrencies();

// Рассчитать и вывести в интерфейс курсы валют

let ratio, reverseRatio;

const setLabelContent = () => {

  const composeLabelText = (ratio) => {
    reverseRatio = 1 / ratio;
    console.log(ratio, reverseRatio);
    sellLabel.textContent = `1 ${sellCurrency} = ${ratio.toFixed(4)} ${buyCurrency}`;
    buyLabel.textContent = `1 ${buyCurrency} = ${reverseRatio.toFixed(4)} ${sellCurrency}`;
  }

  // пары валют без рубля
  if (sellCurrency !== "RUB" && buyCurrency !== "RUB") {
    ratio = rates[sellCurrency] / rates[buyCurrency];
    composeLabelText(ratio);
  } else {
    // покупка рубля за любую валюту
    if (buyCurrency === "RUB") {
      if (sellCurrency === buyCurrency) {
        composeLabelText(1);
      } else {
        ratio = 1 / rates[sellCurrency];
        composeLabelText(ratio);
      }
    } else if (sellCurrency === "RUB" && buyCurrency !== "RUB") {
      // покупка любой валюты за рубль
      ratio = 1 / rates[buyCurrency];
      composeLabelText(ratio);
    }
  }
}

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
      inputs[1].value = (this.value) ? (this.value * ratio).toFixed(4) : "";
    } else {
      inputs[0].value = (this.value) ? (this.value * reverseRatio).toFixed(4) : "";
    }
  });
});

/**
 * Dropdown event listeners
 */

const dropdownContents = document.querySelectorAll(".dropdown__content");
const currentBtn = document.querySelector(".dropdown__button");
const cardInputs = document.querySelectorAll(".currency__input");
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
    setLabelContent();
    setInactiveItems(true);
  })  
});  

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
import converter from "./pages/converter.html";
import ratio from "./pages/ratio.html";
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
  "/ratio": ratio,
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

/**
 * fetching data
 */

const rates = {};

const label = document.querySelector("#sell-currency-label");
const sellHiddenInput = document.querySelector("#sell-hidden-input");
const buyHiddenInput = document.querySelector("#buy-hidden-input");

async function getCurrencies() {
  const responce = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
  const json = await responce.json();
  rates.USD = json.Valute.USD.Value;
  rates.EUR = json.Valute.EUR.Value;
  rates.GBP = json.Valute.GBP.Value;
  rates.JPY = json.Valute.JPY.Value;
  console.log("json > ", json);
  console.log("rates > ", rates);
  label.textContent = `1 ${sellHiddenInput.value} = ${(1 / rates.USD).toFixed(4)} ${buyHiddenInput.value}`
}
getCurrencies();

/**
 * input label text
 */


/**
 * input event listeners
 */

// Разрешаем вводить в инпут только цифры
const currencyAmountInput = document.querySelector(".currency__input");
  
currencyAmountInput.addEventListener("input", function(event) {
  const reg = /[0-9]/g;
  this.value = ( reg.test(event.data) ) ? this.value : this.value.slice(0,-1);
});

/**
 * Dropdown event listeners
 */

const dropdownContents = document.querySelectorAll(".dropdown__content");
const currentBtn = document.querySelector(".dropdown__button");
const cardInputs = document.querySelectorAll(".currency__input");
const dropDownBts = document.querySelectorAll(".dropdown__button");
let arrows = document.querySelectorAll(".arrow");


// [...cardInputs].forEach(item => {
//   item.addEventListener("input", function() {
//     console.log("this > ", this);
//     item.classList.add("calc-value");
//   })
// });

// Клик по дропдауну, раскрыть/закрыть список, развернуть стрелку
[...dropDownBts].forEach(item => {
  item.addEventListener("click", function() {
    const arrow = this.querySelector(".arrow");
    arrow.classList.toggle("arrow-up");
    const dropDownContent = this.closest(".dropdown").querySelector(".dropdown__content");
    dropDownContent.classList.toggle("dropdown__content_active");
  })
});

// Выбор элемента списка. Переложить выбранное значение в скрытый инпут, закрыть селект
const dropDownItems = document.querySelectorAll(".dropdown__item");
[...dropDownItems].forEach(item => {
  item.addEventListener("click", function() {
    const dropDown = this.closest(".dropdown");
    const hidenInput = dropDown.querySelector(".dropdown__input");
    dropDown.querySelector(".dropdown__country").innerHTML = this.innerHTML;
    dropdownContents.forEach( item => {
      item.classList.remove("dropdown__content_active");
    });
    hidenInput.value = this.querySelector(".dropdown__currency").dataset.currency;

    console.log("hidenInput.value > ", hidenInput.value);
  })
});

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

// Нажатие на Tab или Escape. Закрыть дропдаун
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" || event.key === "Escape") {
    let arrows = document.querySelectorAll(".arrow");
    [...arrows].forEach(element => {
      // console.log(element);
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
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
 * input event listeners
 */

const currencyAmountInput = document.querySelector(".currency__input");
  
currencyAmountInput.addEventListener("input", function(event) {
  const reg = /[0-9]/g;
  this.value = ( reg.test(event.data) ) ? this.value : this.value.slice(0,-1);
});

/**
 * Dropdown event listeners
 */

const dropdownContent = document.querySelector(".dropdown__content");
const currentBtn = document.querySelector(".dropdown__button");
const currentItems = document.querySelectorAll(".dropdown__item");
const input = document.querySelector(".dropdown__input");
const arrow = document.querySelector(".arrow");

// Клик по дропдауну. Открыть/закрыть селект
currentBtn.addEventListener("click", function(event) {
  event.stopPropagation();
  arrow.classList.toggle("arrow-up");
  dropdownContent.classList.toggle("dropdown__content_active");
  currentBtn.classList.add("button-active");
})

// Выбор элемента списка. Запомнить выбранное значение, закрыть селект
currentItems.forEach( item => {
  item.addEventListener("click", function(event) {
    event.stopPropagation();
    arrow.classList.remove("arrow-up");
    currentBtn.querySelector(".dropdown__country").innerHTML = this.innerHTML;
    dropdownContent.classList.remove("dropdown__content_active");
    input.value = this.querySelector(".dropdown__currency").dataset.currency;
  })
})

// Клик снаружи дропдауна. Закрыть дропдаун
document.addEventListener("click", (event) => {
  if (event.target !== dropdownContent && event.target !== currentBtn) {
    arrow.classList.remove("arrow-up");
    dropdownContent.classList.remove("dropdown__content_active");
    currentBtn.classList.remove("button-active");
  }
})

// Нажатие на Tab или Escape. Закрыть дропдаун
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" || event.key === "Escape") {
    arrow.classList.remove("arrow-up");
    dropdownContent.classList.remove("dropdown__content_active");
    currentBtn.classList.remove("button-active");
  }
})
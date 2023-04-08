import { CURRENCIES_LIST, CURRENCIES_RATES_URL } from "./constants.js";

// Загрузить курсы валют
async function fetchCurrencies() {
  const responce = await fetch(CURRENCIES_RATES_URL);
  const json = await responce.json();
  return json.Valute;
}

// Вернуть объект с нужными курсами для вывода их в интерфейс
async function getData() {
  const rates = {};
  let currencies = await fetchCurrencies();
  CURRENCIES_LIST.forEach(item => rates[item] = currencies[item]?.Value);
  return rates;
}

export default getData;
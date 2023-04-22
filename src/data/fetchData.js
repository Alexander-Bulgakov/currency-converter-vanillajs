import { CURRENCIES_LIST, CURRENCIES_RATES_URL } from "../constants.js";

// Загрузить курсы валют
async function fetchCurrencies() {
  try {
    const responce = await fetch(CURRENCIES_RATES_URL);
    const json = await responce.json();
    return json.Valute;
  } catch (e) {
    console.log(e);
  }
}

// Вернуть объект только с нужными курсами
async function getRates() {
  const rates = {};
  let currencies = await fetchCurrencies();
  CURRENCIES_LIST.forEach(item => rates[item] = currencies[item]?.Value);
  return rates;
}

export { getRates };
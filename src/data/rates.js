import { getRates } from "../data/fetchData";

let _ratio;

// Рассчитать курсы валют
const calculateRates = async (sellCurrency, buyCurrency) => {
    let rates = await getRates();
    let ratio = null;
    if (sellCurrency !== "RUB" && buyCurrency !== "RUB") {
        ratio = rates[sellCurrency] / rates[buyCurrency];
    } else if (buyCurrency === "RUB") {
        ratio = rates[sellCurrency];
    } else if (sellCurrency === "RUB" && buyCurrency !== "RUB") {
        ratio = 1 / rates[buyCurrency];
    }
    _ratio = ratio;
}

function getRatio() { return _ratio }

function getReverseRatio() { return 1 / _ratio }

export {getRatio, getReverseRatio, calculateRates};
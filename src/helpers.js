import getData from "./data";

const calculateRates = async (sellCurrency, buyCurrency) => {
    let rates = await getData();
    let ratio = null;
    if (sellCurrency !== "RUB" && buyCurrency !== "RUB") {
        ratio = rates[sellCurrency] / rates[buyCurrency];
    } else if (buyCurrency === "RUB") {
        ratio = rates[sellCurrency];
    } else if (sellCurrency === "RUB" && buyCurrency !== "RUB") {
        ratio = 1 / rates[buyCurrency];
    }
    return ratio;
}

export { calculateRates };
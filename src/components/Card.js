// // import card from "./card.html";
// import { calculateRates } from "../helpers";
// import { currencies } from "../data/currencies";

// function setItemToDpdButton(card, currency) {
//     const item = card.querySelector(`[data-currency=${currency}]`).closest(".dropdown__item");
//     card.querySelector(".dropdown__country").innerHTML = item.innerHTML;
// }

// const composeLabelText = async (label, tradeSide) => {
//     let ratio = await calculateRates(currencies.sellCurrency, currencies.buyCurrency);
//     if (tradeSide === "sell") {
//         label.textContent = `1 ${currencies.sellCurrency} = ${ratio.ratio.toFixed(4)} ${currencies.buyCurrency}`;
//     } else {
//         label.textContent = `1 ${currencies.buyCurrency} = ${ratio.reverseRatio.toFixed(4)} ${currencies.sellCurrency}`;
//     }
//     // buyLabel.textContent = `1 ${currencies.buyCurrency} = ${reverseRatio.toFixed(4)} ${currencies.sellCurrency}`;
// }

// function Card(card, currency, tradeSide) {
//     setItemToDpdButton(card, currency);
//     const label = card.querySelector(".currency__label");
//     console.log(label);
//     // console.log(ratio);
//     composeLabelText(label, tradeSide);
// }

// export { Card, composeLabelText };
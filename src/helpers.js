import { calculateRates } from "./data/rates";
import { currencies } from "./data/currencies";
import { getRatio, getReverseRatio } from "./data/rates";

const rotateArrow = (arrow, turnDown = false) => {
  if (turnDown) {
    arrow.classList.remove("arrow-up");
  } else {
    arrow.classList.toggle("arrow-up");
  }
}

const composeLabelText = async (sellLabel, buyLabel) => {
  await calculateRates(currencies.sellCurrency, currencies.buyCurrency);
  sellLabel.textContent = `1 ${currencies.sellCurrency} = ${getRatio().toFixed(4)} ${currencies.buyCurrency}`;
  buyLabel.textContent = `1 ${currencies.buyCurrency} = ${getReverseRatio().toFixed(4)} ${currencies.sellCurrency}`;
}

export { rotateArrow, composeLabelText };
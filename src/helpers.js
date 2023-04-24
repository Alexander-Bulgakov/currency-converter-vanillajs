import { calculateRates } from "./data/rates";
import { currencies } from "./data/currencies";
import { getRatio, getReverseRatio } from "./data/rates";

const rotateArrow = (arrow, turnDown = false) => {
  if (turnDown) {
    arrow.classList.remove("arrow-up");
  } else {
    arrow.classList.toggle("arrow-up");
  }
};

const composeLabelText = async () => {
  const [sellCur, buyCur] = [currencies.sellCurrency, currencies.buyCurrency];
  await calculateRates(sellCur, buyCur);
  const _sellLabel = document.querySelector("#sell-card .currency__label");
  const _buyLabel = document.querySelector("#buy-card .currency__label");
  _sellLabel.textContent = `1 ${sellCur} = ${getRatio().toFixed(4)} ${buyCur}`;
  _buyLabel.textContent = `1 ${buyCur} = ${getReverseRatio().toFixed(
    4
  )} ${sellCur}`;
};

export { rotateArrow, composeLabelText };

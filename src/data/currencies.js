class Currencies {
  #sellCurrency;
  #buyCurrency;
  constructor(currencies) {
    this.#sellCurrency = currencies.sellCurrency;
    this.#buyCurrency = currencies.buyCurrency;
  }

  get sellCurrency() {
    return this.#sellCurrency;
  }

  set sellCurrency(currency) {
    this.#sellCurrency = currency;
  }

  get buyCurrency() {
    return this.#buyCurrency;
  }

  set buyCurrency(currency) {
    this.#buyCurrency = currency;
  }

  reverseCurrencies() {
    [this.#buyCurrency, this.#sellCurrency] = [
      this.#sellCurrency,
      this.#buyCurrency,
    ];
  }
}

let currencies = new Currencies({
  sellCurrency: "RUB",
  buyCurrency: "USD",
});

export { currencies };

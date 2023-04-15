class Currencies {

    constructor(currencies) {
      this.currencies = currencies;
    }
  
    get sellCurrency() {
      return this.currencies.sellCurrency;
    }

    set sellCurrency(currency) {
        this.sellCurrency = currency;
    }

    get buyCurrency() {
        return this.currencies.buyCurrency;
    }

    set buyCurrency(currency) {
        this.currencies.buyCurrency = currency;
    }
  }
  
let currencies = new Currencies({
    sellCurrency: "RUB",
    buyCurrency: "USD"
})

export { currencies };
const rates = {};

async function getCurrencies() {
    const responce = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
    const json = await responce.json();
    rates.USD = json.Valute.USD.Value;
    rates.EUR = json.Valute.EUR.Value;
    rates.GBP = json.Valute.GBP.Value;
    rates.JPY = json.Valute.JPY.Value;
    // setLabelContent();
  }
getCurrencies();

export default rates;
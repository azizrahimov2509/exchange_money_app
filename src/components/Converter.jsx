import { useState, useEffect } from "react";

const CurrencyConverter = () => {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  const apiKey = "34a05128ea41973d91930103";

  const fetchExchangeRates = async (currency) => {
    setLoading(true);
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.result === "success") {
        setRates(data.conversion_rates);
        setCurrencies(Object.keys(data.conversion_rates));
      } else {
        console.error("Ma'lumot olishda xatolik");
      }
    } catch (error) {
      console.error("Valyutalar kurslarini olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates(baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    if (rates[targetCurrency]) {
      setConvertedAmount(amount * rates[targetCurrency]);
    }
  }, [rates, targetCurrency, amount]);

  useEffect(() => {
    const savedBaseCurrency = localStorage.getItem("lastBaseCurrency");
    const savedTargetCurrency = localStorage.getItem("lastTargetCurrency");
    const savedAmount = localStorage.getItem("lastAmount");

    if (savedBaseCurrency) {
      setBaseCurrency(savedBaseCurrency);
    }
    if (savedTargetCurrency) {
      setTargetCurrency(savedTargetCurrency);
    }
    if (savedAmount) {
      setAmount(Number(savedAmount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastBaseCurrency", baseCurrency);
    localStorage.setItem("lastTargetCurrency", targetCurrency);
    localStorage.setItem("lastAmount", amount);
  }, [baseCurrency, targetCurrency, amount]);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
      <h1 className="text-4xl mb-6 text-blue-600 text-center">
        Valyuta konvertori
      </h1>

      <div className="flex flex-wrap justify-center mb-6 space-x-4 space-y-4 sm:space-y-0">
        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="baseCurrency" className="text-lg mb-2">
            Valyutani tanlang (dan):
          </label>
          <select
            id="baseCurrency"
            className="p-3 border rounded-md bg-white shadow-sm"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="targetCurrency" className="text-lg mb-2">
            Valyutani tanlang (ga):
          </label>
          <select
            id="targetCurrency"
            className="p-3 border rounded-md bg-white shadow-sm"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col mb-6 w-full sm:w-auto">
        <label htmlFor="amount" className="text-lg mb-2 mr-1">
          Konvertatsiya qilish uchun summa:
        </label>
        <input
          type="number"
          id="amount"
          className="p-3 border rounded-md bg-white shadow-sm w-full sm:w-auto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="mt-4 text-xl">Yuklanmoqda...</div>
      ) : (
        <div className="mt-4 text-xl">
          <p>
            {amount} {baseCurrency} ={" "}
            {convertedAmount ? convertedAmount.toFixed(2) : "..."}{" "}
            {targetCurrency}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;

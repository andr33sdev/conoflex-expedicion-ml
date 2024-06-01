import { useEffect, useState } from "react";
import axios from "axios";
import { Currency } from "./types";

const App = () => {
  const [currencies, setCurrencies] = useState([]);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(
        "https://backend-expedicion-ml.vercel.app/currencies"
      );
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [currencies]);

  return (
    <div>
      <h1>Currencies</h1>
      <ul>
        {currencies.map((currency: Currency) => (
          <li key={currency.id}>
            <strong>{currency.id}</strong>: {currency.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

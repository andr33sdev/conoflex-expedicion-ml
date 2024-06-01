import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  const fetchAccessToken = async () => {
    try {
      const response = await axios.get("https://backend-expedicion-ml.vercel.app/refresh-token");
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error("Error al obtener el access token:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get("https://backend-expedicion-ml.vercel.app/currencies");
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
    }
  };

  useEffect(() => {
    fetchAccessToken();
    fetchCurrencies();
  }, []);

  return (
    <div>
      <h1>Currencies</h1>
      <ul>
        {currencies.map((currency) => (
          <li key={currency.id}>
            <strong>{currency.id}</strong>: {currency.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

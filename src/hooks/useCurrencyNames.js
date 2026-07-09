import { useEffect, useState } from "react";

function useCurrencyNames() {
  const [currencyNames, setCurrencyNames] = useState({});

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch currency names");
        return res.json();
      })
      .then((data) => {
        setCurrencyNames(data);
      })
      .catch((err) => {
        console.error("Error fetching currency names:", err);
      });
  }, []);

  return currencyNames;
}

export default useCurrencyNames;

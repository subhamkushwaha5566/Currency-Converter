import { useState } from "react";
import "./App.css";
import InputBox from "./components/InputBox";
import useCurrencyInfo from "./hooks/useCurrencyInfo";

function App() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const currencyInfo = useCurrencyInfo(from);
  const options = Object.keys(currencyInfo);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to]);
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/5466785/pexels-photo-5466785.jpeg')`,
      }}
    >
      <div className="w-full max-w-md mx-auto p-4">
        <div className="w-full border border-gray-60 rounded-lg p-6 backdrop-blur-sm bg-white/30">
          
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Currency Converter
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
          >
            {/* From Input */}
            <div className="w-full mb-4">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onAmountChange={(amt) => setAmount(amt)}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-2">
              <button
                type="button"
                className="border-2 border-white rounded-md bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 transition"
                onClick={swap}
              >
                Swap
              </button>
            </div>

            {/* To Input */}
            <div className="w-full mb-4">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisable
              />
            </div>

            {/* Convert Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import InputBox from "./components/InputBox";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import useCurrencyNames from "./hooks/useCurrencyNames";
import { getCountryCode } from "./components/CustomDropdown";

function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rotateIcon, setRotateIcon] = useState(0);
  const [includeFee, setIncludeFee] = useState(false);

  const currencyInfo = useCurrencyInfo(from);
  const currencyNames = useCurrencyNames();
  const options = Object.keys(currencyInfo);

  // Trigger conversion when amount, currencyInfo, to, or includeFee changes
  useEffect(() => {
    if (currencyInfo && currencyInfo[to]) {
      let finalAmount = amount * currencyInfo[to];
      if (includeFee) {
        finalAmount = finalAmount * 0.995; // Subtract 0.5% conversion fee
      }
      setConvertedAmount(Number(finalAmount.toFixed(4)));
    } else {
      setConvertedAmount(0);
    }
  }, [amount, currencyInfo, to, includeFee]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setAmount(convertedAmount);
    setRotateIcon((prev) => prev + 180);
  };

  // Major currencies to show in the popular conversion grid
  const popularCurrencies = ["usd", "eur", "gbp", "inr", "jpy", "cad", "aud", "cny", "chf", "sgd"];

  const formatNumber = (num, minDec = 2, maxDec = 4) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec,
    }).format(num);
  };

  const getExchangeRateText = () => {
    if (currencyInfo && currencyInfo[to]) {
      const rate = currencyInfo[to];
      const invRate = 1 / rate;
      return {
        forward: `1 ${from.toUpperCase()} = ${formatNumber(rate, 2, 6)} ${to.toUpperCase()}`,
        inverse: `1 ${to.toUpperCase()} = ${formatNumber(invRate, 2, 6)} ${from.toUpperCase()}`,
      };
    }
    return null;
  };

  const rates = getExchangeRateText();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Premium Animated Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-indigo-600/20 animate-blob-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-cyan-500/25 animate-blob-2 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-stretch justify-center">
        {/* Left Side: Converter Panel */}
        <div className="flex-1 w-full max-w-xl mx-auto lg:mx-0 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle top decoration line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
          
          <div>
            {/* Header / Brand */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white bg-clip-text">
                  ApexExchange
                </h1>
              </div>
              
              {/* Live Rate Pulse Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-light" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
                  Live Rates
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Source Currency */}
              <InputBox
                label="Source Amount"
                amount={amount}
                currencyOptions={options}
                onAmountChange={setAmount}
                onCurrencyChange={setFrom}
                selectCurrency={from}
                currencyNames={currencyNames}
              />

              {/* Swap Button Wrapper */}
              <div className="relative h-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={swap}
                  style={{ transform: `rotate(${rotateIcon}deg)` }}
                  className="z-10 absolute p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white shadow-xl shadow-indigo-600/30 transition-all duration-500 cursor-pointer border border-indigo-400/20"
                  aria-label="Swap Currencies"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Target Currency */}
              <InputBox
                label="Converted Amount"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={setTo}
                selectCurrency={to}
                currencyNames={currencyNames}
                amountDisable
              />

              {/* Fee Toggle Widget */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/20 border border-slate-800/40 mt-6">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200">Apply standard bank fee</span>
                  <span className="text-[10px] text-slate-400">Include a simulated 0.5% exchange rate fee</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeFee(!includeFee)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    includeFee ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      includeFee ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </form>
          </div>

          {/* Rates Display Details Footer */}
          {rates && (
            <div className="mt-8 pt-6 border-t border-slate-800/50 space-y-2.5">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  Exchange Formula
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-base font-bold text-indigo-400 text-glow-indigo">
                    {rates.forward}
                  </span>
                  <span className="text-xs text-slate-400">
                    {rates.inverse}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Popular Conversions Panel */}
        <div className="w-full lg:w-[380px] glass-panel rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500" />
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4.5 h-4.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h2 className="text-md font-bold text-white tracking-wide">
                Popular Exchanges
              </h2>
            </div>
            
            <p className="text-[11px] text-slate-400 mb-5 leading-normal">
              Quick exchange summary of your entered base amount of <span className="font-semibold text-slate-200">{formatNumber(amount, 0, 4)} {from.toUpperCase()}</span>:
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {popularCurrencies
                .filter((code) => code !== from.toLowerCase())
                .map((code) => {
                  const rate = currencyInfo[code] || 0;
                  let convertedVal = amount * rate;
                  if (includeFee) {
                    convertedVal = convertedVal * 0.995;
                  }
                  const displayCountry = getCountryCode(code);
                  const displayFlag = `https://flagcdn.com/w40/${displayCountry}.png`;
                  
                  return (
                    <div
                      key={code}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/20 border border-slate-900 hover:border-slate-800/80 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={displayFlag}
                          alt={`${code} Flag`}
                          className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-slate-800/30 shrink-0"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="flex flex-col min-w-0 leading-tight">
                          <span className="text-xs font-semibold text-slate-200 uppercase">
                            {code}
                          </span>
                          <span className="text-[9px] text-slate-500 truncate max-w-[140px]">
                            {currencyNames[code] || ""}
                          </span>
                        </div>
                      </div>

                      <div className="text-right pl-2 leading-tight">
                        <span className="text-xs font-bold text-cyan-400 text-glow-cyan">
                          {formatNumber(convertedVal, 2, 4)}
                        </span>
                        <div className="text-[8px] text-slate-500">
                          Rate: {formatNumber(rate, 2, 5)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-6 text-[10px] text-slate-400 text-center leading-relaxed">
            Exchange rates are updated live on load.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

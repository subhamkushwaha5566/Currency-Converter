import React, { useId } from "react";
import CustomDropdown from "./CustomDropdown";

function InputBox({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = "usd",
  amountDisable = false,
  currencyDisable = false,
  currencyNames = {},
  className = "",
}) {
  const amountInputId = useId();

  return (
    <div
      className={`glass-input p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 hover:border-slate-800 ${className}`}
    >
      {/* Amount Input Section */}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={amountInputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 inline-block"
        >
          {label}
        </label>
        <input
          id={amountInputId}
          className="outline-none w-full bg-transparent py-1 text-2xl font-bold text-slate-100 placeholder-slate-600 border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          placeholder="0.00"
          disabled={amountDisable}
          value={amount === 0 ? "" : amount}
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
            if (onAmountChange) {
              onAmountChange(isNaN(val) ? 0 : val);
            }
          }}
        />
      </div>

      {/* Currency Selector Section */}
      <div className="w-[125px] sm:w-[150px] shrink-0 flex flex-col items-end">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Currency
        </span>
        <CustomDropdown
          options={currencyOptions}
          selectedCurrency={selectCurrency}
          onCurrencyChange={onCurrencyChange}
          currencyNames={currencyNames}
          disabled={currencyDisable}
        />
      </div>
    </div>
  );
}

export default InputBox;

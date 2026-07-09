import React, { useState, useEffect, useRef } from "react";

const getCountryCode = (currencyCode) => {
  if (!currencyCode) return "us";
  const code = currencyCode.toLowerCase();
  
  const mapping = {
    usd: "us",
    eur: "eu", // European Union
    gbp: "gb", // United Kingdom
    inr: "in", // India
    aud: "au", // Australia
    cad: "ca", // Canada
    jpy: "jp", // Japan
    cny: "cn", // China
    chf: "ch", // Switzerland
    nzd: "nz", // New Zealand
    sek: "se", // Sweden
    nok: "no", // Norway
    mxn: "mx", // Mexico
    sgd: "sg", // Singapore
    hkd: "hk", // Hong Kong
    krw: "kr", // South Korea
    try: "tr", // Turkey
    rub: "ru", // Russia
    brl: "br", // Brazil
    zar: "za", // South Africa
    ars: "ar", // Argentina
    clp: "cl", // Chile
    cop: "co", // Colombia
    dkk: "dk", // Denmark
    egp: "eg", // Egypt
    idr: "id", // Indonesia
    ils: "il", // Israel
    myr: "my", // Malaysia
    php: "ph", // Philippines
    pln: "pl", // Poland
    sar: "sa", // Saudi Arabia
    thb: "th", // Thailand
    twd: "tw", // Taiwan
    vnd: "vn", // Vietnam
    aed: "ae", // UAE
  };
  
  return mapping[code] || code.substring(0, 2);
};

function CustomDropdown({
  options = [],
  selectedCurrency = "usd",
  onCurrencyChange,
  currencyNames = {},
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedFullName = currencyNames[selectedCurrency] || "";
  const countryCode = getCountryCode(selectedCurrency);
  const flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;

  // Filter options based on search query (by code or full name)
  const filteredOptions = options.filter((code) => {
    const name = (currencyNames[code] || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return code.toLowerCase().includes(query) || name.includes(query);
  });

  const handleSelect = (code) => {
    if (onCurrencyChange) {
      onCurrencyChange(code);
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left rounded-lg glass-input text-slate-100 font-medium hover:border-slate-700/80 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src={flagUrl}
            alt={`${selectedCurrency} Flag`}
            className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-slate-700/40 shrink-0"
            onError={(e) => {
              e.target.style.display = "none"; // Hide if fails
            }}
          />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="text-sm font-semibold tracking-wide text-slate-100">
              {selectedCurrency.toUpperCase()}
            </span>
            {selectedFullName && (
              <span className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">
                {selectedFullName}
              </span>
            )}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-full mt-1.5 glass-panel rounded-xl shadow-2xl border border-slate-800/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-w-[280px] sm:max-w-none">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-800/50 bg-slate-950/40">
            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full bg-slate-900/80 text-slate-200 placeholder-slate-500 text-xs px-3 py-2 pl-8 rounded-md border border-slate-800/80 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                placeholder="Search currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <svg
                className="absolute left-2.5 w-3.5 h-3.5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[220px] overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500">
                No results found
              </div>
            ) : (
              filteredOptions.map((code) => {
                const optCountryCode = getCountryCode(code);
                const optFlagUrl = `https://flagcdn.com/w40/${optCountryCode}.png`;
                const isSelected = code === selectedCurrency;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/20"
                        : "text-slate-300 hover:bg-slate-800/40 hover:text-slate-100"
                    }`}
                  >
                    <img
                      src={optFlagUrl}
                      alt={`${code} Flag`}
                      className="w-5.5 h-4 object-cover rounded-[2px] shadow-sm border border-slate-700/20 shrink-0"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="flex flex-col min-w-0 leading-tight">
                      <span className="font-semibold text-slate-200">
                        {code.toUpperCase()}
                      </span>
                      {currencyNames[code] && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[170px] font-normal">
                          {currencyNames[code]}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
export { getCountryCode };

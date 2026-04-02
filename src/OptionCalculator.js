import React, { useState } from "react";
import ChartComponent from "./ChartComponent";

function OptionCalculator() {
  const [results, setResults] = useState([]);
  const [optimal, setOptimal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ticker = e.target.ticker.value.toUpperCase();
    const days = parseInt(e.target.days.value);

    // Call Netlify Function
    const res = await fetch(`/.netlify/functions/options?ticker=${ticker}`);
    const { quote, chain } = await res.json();
    const currentPrice = quote.regularMarketPrice;

    const strikes = [];
    for (let pct = 70; pct <= 130; pct += 5) {
      strikes.push((currentPrice * pct / 100).toFixed(2));
    }

    const expiration = chain.expirationDates[0];
    const options = chain.options.find(opt => opt.expirationDate === expiration);

    const data = [];
    [...options.calls, ...options.puts].forEach(opt => {
      if (strikes.includes(opt.strike.toFixed(2))) {
        const couponPct = (opt.lastPrice / currentPrice) * 100;
        const annualised = couponPct * (365 / days);
        data.push({
          stock: ticker,
          type: opt.contractSymbol.includes("C") ? "Short Call" : "Short Put",
          strike: opt.strike,
          strikePct: (opt.strike / currentPrice) * 100,
          premium: opt.lastPrice,
          couponPct,
          annualised,
          days
        });
      }
    });

    const best = data.reduce((max, row) => row.annualised > max.annualised ? row : max, data[0]);

    setResults(data);
    setOptimal(best);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="ticker" placeholder="Stock ticker (e.g. AMZN)" />
        <input name="days" placeholder="Days to expiration" />
        <button type="submit">Analyze</button>
      </form>

      {results.length > 0 && (
        <>
          <table border="1" cellPadding="5" style={{ marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Stock</th><th>Type</th><th>Strike</th><th>Strike %</th>
                <th>Premium</th><th>Coupon %</th><th>Annualised %</th><th>Days</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i} style={{ backgroundColor: optimal && row.strike === optimal.strike && row.type === optimal.type ? "#ffe0b2" : "transparent" }}>
                  <td>{row.stock}</td><td>{row.type}</td><td>{row.strike}</td>
                  <td>{row.strikePct.toFixed(2)}%</td><td>{row.premium}</td>
                  <td>{row.couponPct.toFixed(2)}%</td><td>{row.annualised.toFixed(2)}%</td>
                  <td>{row.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ChartComponent data={results} optimal={optimal} />
          <p><strong>Optimal strike:</strong> {optimal.stock} {optimal.type} at {optimal.strike} with {optimal.annualised.toFixed(2)}% annualised yield.</p>
        </>
      )}
    </div>
  );
}

export default OptionCalculator;

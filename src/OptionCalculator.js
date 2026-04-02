const res = await fetch(`/.netlify/functions/options?ticker=${ticker}`);
const { quote, chain } = await res.json();

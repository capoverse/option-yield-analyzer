const yahooFinance = require("yahoo-finance2").default;

exports.handler = async (event) => {
  const { ticker, days } = event.queryStringParameters;
  try {
    const quote = await yahooFinance.quote(ticker);
    const chain = await yahooFinance.options(ticker);
    return {
      statusCode: 200,
      body: JSON.stringify({ quote, chain, days })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

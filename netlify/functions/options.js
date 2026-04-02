const yahooFinance = require("yahoo-finance2").default;

exports.handler = async (event) => {
  const { ticker } = event.queryStringParameters;
  try {
    const quote = await yahooFinance.quote(ticker);
    const chain = await yahooFinance.options(ticker);
    return {
      statusCode: 200,
      body: JSON.stringify({ quote, chain })
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

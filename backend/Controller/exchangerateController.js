const axios = require('axios');

exports.getExchangeRate = async (req, res) => {
    try {
        const { baseCurrency, targetCurrency } = req.query;
        const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${targetCurrency}`);
        const rate = response.data.rates[targetCurrency];
        res.status(200).json({ rate });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exchange rate', error });
    }
};

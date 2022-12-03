const cron = require('node-cron');
const fetch = require('node-fetch');
const connection = require('../../db');
const { logError } = require('../logger');
const { repositories } = require('data-access-utility');
const { EVERY_HOUR } = require('./schedule-constants');

/**
 * Fetch json data from CoinGecko api
 * @param {String} apiUrl 
 * @returns json token data 
 */
const fetchApiData = async (apiUrl) => {
  try {
    const apiResponse = await fetch(apiUrl);
    return await apiResponse.json();
  } catch (err) {
    logError(err);
    console.log(err);
  }
}

/**
 * Call fetch api data function and update currect price and price change percentage each listed token to database by using cron job hourly
 */
const updateCryptoTokenPrice = () => {
  cron.schedule(EVERY_HOUR, async () => {
    try {
      const Tokens = new repositories.Token(connection);
      const tokens = await Tokens.getAllTokens(false);
      
      tokens.forEach( async (token) => {
        const tokenSymbol = await Tokens.getSymbol(token);
        const apiUrl = await Tokens.getApiUrl(token);
        fetchApiData(apiUrl)
          .then( async (responseData) => {
            const responseDataCurrentPrice = responseData.market_data.current_price;
            const responseDataPriceChangePercentage = responseData.market_data.price_change_percentage_1h_in_currency;
            
            await Tokens.updateTokenAttributes( token, {
              current_price: responseDataCurrentPrice,
              price_change_percentage: responseDataPriceChangePercentage
            });

            console.log(`Token ${tokenSymbol} Price Updated`);
          });
      });
    } catch (err) {
      logError(err);
      console.log(err);
    }
  });
}

const cronJob = {
  updateCryptoTokenPrice
}

module.exports = cronJob
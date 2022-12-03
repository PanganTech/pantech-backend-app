const axios = require('axios');

const {
  TOKEN
} = process.env;

const getTweet = async (twitter) => {
    const headers = {
        'Authorization' : TOKEN
    }
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${twitter}&tweet.fields=created_at`
    const config = {
        method: 'GET',
        url,
        headers,
    };
    const tweet = await axios(config);
    return tweet.data
}

const axiosFunction = {
    getTweet,
}

module.exports = axiosFunction
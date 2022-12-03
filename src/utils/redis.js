const redis = require('redis');
const { getTweet } = require('./axios');

const {
    REDIS_URL
} = process.env;

const init = async () => {
    const client = redis.createClient({
        url: `redis://${REDIS_URL}`,
    });
    return client;
}
const connect = async (client) => {
    await client.connect()
}

const getCache = async (client, data) => {
    const datas = await client.get(data);
    return datas
}

const setCache = async (client, key, data) => {
    await client.setEx(key, '10800',data)
}

const redisFunction = {
    getCache,
    setCache,
    init,
    connect
}

module.exports = redisFunction
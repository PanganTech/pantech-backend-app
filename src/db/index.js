const { database } = require('data-access-utility');

const connection = database.openConnection();

module.exports = connection
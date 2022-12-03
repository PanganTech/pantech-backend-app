require('dotenv').config();
const http = require('http');
const app = require('./app');

const { logSuccess } = require('./utils/logger');
const { PORT } = process.env;
const { ENABLE_NEWRELIC } = process.env;

if (ENABLE_NEWRELIC == "true"){
    require('newrelic');
}

const httpServer = http.createServer(app)
httpServer.listen(PORT, function () {
    logSuccess(`HTTP Listening on ${PORT}`);

});
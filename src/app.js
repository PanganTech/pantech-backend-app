const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes');
const { logError } = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const apiDocumentation = require('./Pantech.postman_collection.json-OpenApi3Json.json')

// Server configuration
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api/v1', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));
app.use('/', (req, res) => {
    logError(`${req.originalUrl} Route not found`);
    res.status(404).json({ statusCode: 404, body: { responseCode: "Route not found" } })
})


module.exports = app;
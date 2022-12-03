const router = require('express').Router()
const { helpers } = require('backend-utility');
const { responses } = helpers;
const { error: errorResponse, success: successResponse } = responses;


const validator = (req, res, next) => {
    //validate request body here before letting it move forward.
    next();
  }

const healthChecker = async (req, res) => {
    const response = successResponse("Health Check","success");
    res.send(response);
}

router.get('/health-check', healthChecker)

module.exports = router
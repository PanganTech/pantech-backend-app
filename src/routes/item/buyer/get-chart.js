const connection = require('../../../db');
const router = require('express').Router()
const { logError } = require('../../../utils/logger')
const { repositories } = require('data-access-utility');
const { helpers, errors, CommonError } = require('backend-utility');
const { Serializer } = require('jsonapi-serializer');

const { responses } = helpers;

const { UserNotFoundException } = errors.codes;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Validate the request body for Info Controller
 */
const validator = (req, res, next) => {
  //validate request body here before letting it move forward.
  next();
}

/**
* Serialize user response
* @param {Object} data
*/
const serialize = (data) => {
  const serializerSchema = ({
    id: 'id',
    attributes: [
      'buyer_id',
      'chart',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Charts', serializerSchema).serialize(data);
}

/**
 * Controller used to show user info after login. 
 */
const chartController = async(req, res) => {
    let response
    const { user_id } = req.auth

    try {
        const Charts = new repositories.Chart(connection);
        const chart = await Charts.getChart(user_id, false);
        if (!chart) throw new CommonError(UserNotFoundException);
        const chartData = await serialize(chart);

    const customResponse = {
      chart: chartData.data,
    }
    response = successResponse('Chart Item', customResponse);
  } catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.get('/chart', validator, chartController)

module.exports = router
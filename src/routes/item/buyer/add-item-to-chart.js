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
    let response, newChart
    const { user_id } = req.auth
    const { itemId, jumlah } = req.body

    try {
        const Charts = new repositories.Chart(connection);
        const Items = new repositories.Item(connection);

        const chart = await Charts.getChart(user_id, false);
        if (!chart) throw new CommonError(UserNotFoundException);
        const item = await Items.getItemById(itemId, false);
        const harga = await Items.getPrice(item)
        let itemInChart = await Charts.getItemInChart(chart, false)

        const objWithIdIndex = itemInChart.findIndex((obj) => obj.item_id === parseInt(itemId));

        if (objWithIdIndex > -1) {
            itemInChart.splice(objWithIdIndex, 1);
        }
        
        let total = harga * jumlah;
        console.log(harga)
        
        // console.log(data)
        newChart = {
            'item_id': parseInt(itemId),
            'jumlah': parseInt(jumlah),
            'total': total
        }
        itemInChart.push(newChart);
        console.log(itemInChart)

        const a = await Charts.updateChartAttribute(chart,itemInChart)
         
        const chartData = await serialize(a);

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

router.put('/chart', validator, chartController)

module.exports = router
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
      'seller_id',
      'items_id',
      'total',
      'status',

    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Transaction', serializerSchema).serialize(data);
}

/**
 * Controller used to show user info after login. 
 */
const chartController = async(req, res) => {
    let response, seller_id
    let allTotal = 0;
    let itemIds = []
    const { user_id } = req.auth
    const { items } = req.body

    try {
        const Charts = new repositories.Chart(connection);
        const Items = new repositories.Item(connection);
        const ItemTransactions = new repositories.ItemTransaction(connection)

        for (const itemBody of items){
            const itemId = itemBody.item_id;
            itemIds.push(itemId)

            const total = itemBody.total
            const chart = await Charts.getChart(user_id, false);
            let itemInChart = await Charts.getItemInChart(chart, false)
            const objWithIdIndex = itemInChart.findIndex((obj) => obj.item_id === parseInt(itemId));

            if (objWithIdIndex > -1) {
                itemInChart.splice(objWithIdIndex, 1);
            }

            allTotal = allTotal + total;
            const item = await Items.getItemById(itemId)
            seller_id = await Items.getUserId(item)
        }

        const transaction = await ItemTransactions.create(user_id, seller_id, itemIds, allTotal)
        const transactionData = await serialize(transaction)

        const customResponse = {
            transaction: transactionData.data,
        }
        response = successResponse('Transaction Data', customResponse);
  } catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.post('/check-out', validator, chartController)

module.exports = router
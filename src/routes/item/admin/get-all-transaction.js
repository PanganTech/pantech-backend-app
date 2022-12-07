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
const infoController = async(req, res) => {
    let response
    const { user_id } = req.auth

    try {
        const Transaction = new repositories.ItemTransaction(connection);
        const transaction = await Transaction.getAllTransaction(false);
        if (!transaction) throw new CommonError(UserNotFoundException);
        const transactionData = await serialize(transaction);

    const customResponse = {
      transaction: transactionData.data,
    }
    response = successResponse('Transaction', customResponse);
  } catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.get('/get-transaction', validator, infoController)

module.exports = router
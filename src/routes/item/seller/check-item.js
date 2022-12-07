const connection = require('../../../db');
const router = require('express').Router()
const { logError } = require('../../../utils/logger')
const { repositories } = require('data-access-utility');
const { helpers, errors, CommonError, configs } = require('backend-utility');
const { Serializer } = require('jsonapi-serializer');
const { User } = require('discord.js');

const { responses } = helpers;
const { enums } = configs;
const {
    SEARCHING
} = enums.TransactionStatus;


const { BalanceLow } = errors.codes;
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

const serializeUserLocation = (data) => {
  const serializerSchema = ({
    id: 'id',
    attributes: [
      'longitude',
      'latitude',
      'user',
    ],
    user: {
      attributes: [
        'email',
        'type',
        'first_name',
        'middle_name',
        'last_name',
        'phone',
        'address',
        'city',
        'state',
        'bio',
        'status',
        'createdAt',
        'updatedAt',
      ],
    },
    keyForAttribute: 'camelCase'
  })
  return new Serializer('Driver Location', serializerSchema).serialize(data);
}

/**
 * Controller used to show user info after login. 
 */
const infoController = async(req, res) => {
    let response
    const { user_id } = req.auth
    const { transactionId } = req.body

    try {
        const ItemTransactions = new repositories.ItemTransaction(connection);
        const transaction = await ItemTransactions.getTransactionById(transactionId, false);
        const buyerId = await ItemTransactions.getBuyerId(transaction)

        const updateStatus = await ItemTransactions.updateTransactionStatus(transaction, SEARCHING)

        const UserLocation = new repositories.UserLocation(connection)
        const driverLocation = await UserLocation.getDriverLocation(false)
        const buyerLocation = await UserLocation.getUserLocationById(buyerId, false)
        const sellerLocation = await UserLocation.getUserLocationById(user_id, false)

        const updateData = await serialize(updateStatus)
        const driverLocationData = await serializeUserLocation(driverLocation)
        const buyerLocationData = await serializeUserLocation(buyerLocation)
        const selletLocationData = await serializeUserLocation(sellerLocation)

        const customResponse = {
            transaction: updateData.data,
            driverLocation: driverLocationData.data,
            buyerLocation: buyerLocationData.data,
            sellerLocation: selletLocationData.data,
        }
        response = successResponse('Transaction', customResponse);
    } catch (err) {
        logError(err);
        response = errorResponse(err);
    }

    res.send(response);
}

router.put('/confirm', validator, infoController)

module.exports = router
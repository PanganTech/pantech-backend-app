const connection = require('../../../db');
const router = require('express').Router()
const { logError } = require('../../../utils/logger')
const { repositories } = require('data-access-utility');
const { helpers, errors, CommonError, configs } = require('backend-utility');
const { Serializer } = require('jsonapi-serializer');

const { responses } = helpers;
const { enums } = configs;
const {
    PROCESS
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

/**
 * Controller used to show user info after login. 
 */
const infoController = async(req, res) => {
    let response
    const { user_id } = req.auth
    const { transactionId, method } = req.body

    try {
        const ItemTransactions = new repositories.ItemTransaction(connection);
        const UserWallet = new repositories.UserWallet(connection)
        const transaction = await ItemTransactions.getTransactionById(transactionId, false);

        if(method === 'wallet'){
            const userWallet = await UserWallet.getUserWalletById(user_id, false)
            const buyerBalance = await UserWallet.getBalance(userWallet)
            const sellerId =  await ItemTransactions.getSellerId(transaction)
            const sellerWallet = await UserWallet.getUserWalletById(sellerId, false)
            const sellerBalance = await UserWallet.getBalance(sellerWallet)
            const total = await ItemTransactions.getTotal(transaction)
            if(buyerBalance < total) {
                throw new CommonError(BalanceLow);
            }
            await UserWallet.updateBalance(userWallet, buyerBalance-total)
            await UserWallet.updateBalance(sellerWallet, sellerBalance+total)

        }
        const updateStatus = await ItemTransactions.updateTransactionStatus(transaction, PROCESS)
        const updateData = await serialize(updateStatus)

        const customResponse = {
            transaction: updateData.data,
        }
        response = successResponse('Transaction', customResponse);
    } catch (err) {
        logError(err);
        response = errorResponse(err);
    }

    res.send(response);
}

router.put('/payment', validator, infoController)

module.exports = router
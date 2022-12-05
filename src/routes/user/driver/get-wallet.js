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
      'user_id',
      'balance',
      'createdAt',
      'updatedAt',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Users Wallet', serializerSchema).serialize(data);
}

/**
 * Controller used to show user info after login. 
 */
const infoController = async(req, res) => {
    let response
    const { user_id } = req.auth

    try {
        const Users = new repositories.UserWallet(connection);
        const user = await Users.getUserWalletById(user_id, false);
        if (!user) throw new CommonError(UserNotFoundException);
        const userData = await serialize(user);

    const customResponse = {
      user: userData.data,
    }
    response = successResponse('User Wallet', customResponse);
  } catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.get('/wallet-info', validator, infoController)

module.exports = router
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
      'user_wallet',
    ],
    'user_wallet':{
      attributes: [
        'balance',
        'createdAt',
        'updatedAt',
      ], 
    },
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Users', serializerSchema).serialize(data);
}

/**
 * Controller used to show user info after login. 
 */
const infoController = async(req, res) => {
    let response
    const { user_id } = req.auth
    const { search } = req.body

    try {
        const Users = new repositories.User(connection);
        const user = await Users.getAllUsers(search, false);
        if (!user) throw new CommonError(UserNotFoundException);
        const userData = await serialize(user);
        console.log(user)
    const customResponse = {
      item: userData.data,
    }
    response = successResponse('Available Item', customResponse);
  } catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.get('/all-user', validator, infoController)

module.exports = router
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
      'item_name',
      'price',
      'stock',
      'user',
    ],
    'user':{
        attributes: [
            'user_id',
            'type',
            'first_name',
            'city',
            'state'
        ]
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
    const { itemName, price, stock, category} = req.body

    try {
        const Items = new repositories.Item(connection);
        const item = await Items.create(user_id, itemName, price, stock, category);
        const itemData = await serialize(item);

    const customResponse = {
      item: itemData.data,
    }
    response = successResponse('Available Item', customResponse);
  } catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.post('/create', validator, infoController)

module.exports = router
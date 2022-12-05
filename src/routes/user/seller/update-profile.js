const connection = require('../../../db');
const router = require('express').Router();
const { logError } = require('../../../utils/logger');
const { repositories } = require('data-access-utility');
const { errors, helpers, configs, CommonError } = require('backend-utility');
const { Serializer } = require('jsonapi-serializer');
const { validationResult, check } = require('express-validator');

const { responses } = helpers;

const { error: errorResponse, success: successResponse } = responses;
const { UserNotFoundException } = errors.codes;

const { responses: successHelperResponse } = configs;
const { UpdateProfile } = successHelperResponse;

/**
 * Validate the request body for Update Profile Controller
 */
const validator = [
  check([
    'firstName',
    'middleName',
    'lastName',
    'phone',
    'address',
    'city',
    'state',
    'country',
    'zip',
    'telegram',
    'bio',
  ]).optional().isString(),
  (req, res, next) => {
    //validate request body here before letting it move forward.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }]

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
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Users', serializerSchema).serialize(data);
}

/**
 * Controller used to update user profile information. 
 * @param {String} firstName 
 * @param {String} middleName 
 * @param {String} lastName 
 * @param {String} phone 
 * @param {String} address 
 * @param {String} city 
 * @param {String} state 
 * @param {String} country 
 * @param {String} zip 
 * @param {String} telegram
 * @param {String} picture // TODO: Waiting for AWS S3 implementation
 * @param {Text} bio
 */
const updateProfileInformationController = async (req, res) => {
  let response;
  let {
    firstName,
    middleName,
    lastName,
    phone,
    address,
    city,
    state,
    // picture, // TODO: Waiting for AWS S3 implementation
    bio,
  } = req.body;
  const { email } = req.auth;

  try {
    const Users = new repositories.User(connection);
    const user = await Users.getByEmailRaw(email, false);
    if (!user) throw new CommonError(UserNotFoundException);

    await Users.updateUserAttributes(user, {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      phone,
      address,
      city,
      state,
      bio,
    });

    const userData = await serialize(user);
    const customResponse = {
      user: userData.data,
      UpdateProfile
    }
    response = successResponse('User Update Profile Information', customResponse);

  }
  catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.put('/update-profile', validator, updateProfileInformationController)

module.exports = router
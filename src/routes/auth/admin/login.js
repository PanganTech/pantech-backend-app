const bcrypt = require('bcrypt');
const connection = require('../../../db');
const router = require('express').Router()
const { logError } = require('../../../utils/logger')
const { errorMessages } = require('../../../utils/constants');
const { repositories } = require('data-access-utility');
const { helpers, configs, errors, CommonError } = require('backend-utility');
const { Serializer } = require('jsonapi-serializer');
const { check, oneOf, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { isValid } = helpers.functions;

const { responses, jwt } = helpers;
const { UserType } = configs.enums;

const { getToken } = jwt;
const { SELLER, BUYER, DRIVER, ADMIN } = UserType;

const { UserNotApproved, LoginNotApproved, InvalidActionSpecified } = errors.codes;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Validate the request body for Login Controller
 */
const validator = [
  check('username')
    .exists()
    .withMessage(errorMessages.buyer.EMAIL_REQUIRED)
    .bail()
    .isEmail()
    .withMessage(errorMessages.buyer.EMAIL_FORMAT)
    .bail(),,
  check('password')
    .exists()
    .withMessage(errorMessages.buyer.PASSWORD_REQUIRED)
  ,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logError(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    next()
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
 * Controller used to login a user and get the auth token. 
 */
const loginController = async (req, res) => {

  let response;
  let { email, password } = req.body;

  try {
    const Users = new repositories.User(connection);
    const user = await Users.getByEmailRaw(email, false);
    const user_id = await Users.getId(user)

    if (!user) throw new CommonError(LoginNotApproved);
    const userPassword = await Users.getPassword(user);

    const userType = await Users.getType(user);
    const passwordMatched = bcrypt.compareSync(password, userPassword);
    if (!passwordMatched) throw new CommonError(LoginNotApproved);
    if (userType !== ADMIN) throw new CommonError(LoginNotApproved);

    const token = getToken({ email: email.toLowerCase(), user_id });
    const userdat = await Users.getByEmail(email, false)
    const userData = await serialize(userdat);
    const customResponse = {
      user: userData.data,
      token: token
    }
    

    response = successResponse('User Data', customResponse);

  }
  catch (err) {
    logError(err);
    response = errorResponse(err);
  }

  res.send(response);
}

router.post('/login', loginController)

module.exports = router
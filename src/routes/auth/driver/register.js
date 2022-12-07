const bcrypt = require('bcrypt');
const crypto = require('crypto');
const connection = require('../../../db');
const { v4: uuidv4 } = require('uuid');
const router = require('express').Router();
const { logError } = require('../../../utils/logger');
const { repositories } = require('data-access-utility');
const { errorMessages } = require('../../../utils/constants');
const { configs, errors, helpers, CommonError } = require('backend-utility');
const { Serializer } = require('jsonapi-serializer');
const { check, validationResult } = require('express-validator');

const { responses } = helpers;

const { UserType } = configs.enums;
const { DRIVER } = UserType;

const { error: errorResponse, success: successResponse } = responses;
const { EmailAlreadyExistException, PasswordNotMatchException } = errors.codes;

const { responses: successHelperResponse } = configs;
const { VerifyEmailResponseCode, SendEmailVerifyResponse } = successHelperResponse;
/**
 * Validate the request body for Signup Controller
 */
const validator = [
	check('email')
		.exists()
		.trim()
		.escape()
		.withMessage(errorMessages.buyer.EMAIL_REQUIRED)
		.bail()
		.isEmail()
		//.normalizeEmail()
		.withMessage(errorMessages.buyer.EMAIL_FORMAT),
	check('firstName')
		.exists()
		.withMessage(errorMessages.buyer.FIRST_NAME_REQUIRED),
	check('password')
		.exists()
		.withMessage(errorMessages.buyer.PASSWORD_REQUIRED)
		.isLength({ min: 6 })
		.matches(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
		) // 1 uppercase, 1 lowercase, 1 special character
		.withMessage(errorMessages.buyer.PASSWORD_FORMAT),
	check('confirmPassword')
		.exists()
		.withMessage(errorMessages.buyer.PASSWORD_REQUIRED)
		.isLength({ min: 6 })
		.matches(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
		) // 1 uppercase, 1 lowercase, 1 special character
		.withMessage(errorMessages.buyer.PASSWORD_FORMAT)
	, (req, res, next) => {
		let errorArray = []
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const array = errors.array()
			for(let i = 0; i < array.length; i++){
				let value = array[i].value
            	let msg = array[i].msg
				let param = array[i].param
				let location = array[i].location
				if (param === 'password' || param === 'confirmPassword'){
					errorArray.push({msg: msg, param: param, location: location})
				} else {
					errorArray.push({value: value, msg: msg, param: param, location: location})
				}
            }
			console.log(errors);
			return res.status(400).json({ errors: errorArray });
		}
		next()
	}]

/**
* Serialize user response
* @param {Object} data
*/
const serialize = (data) => {
	const serializerSchema = ({
		id: 'uid',
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
			'country',
			'bio',
			'createdAt',
			'updatedAt',
		],
		keyForAttribute: 'camelCase',
	});

	return new Serializer('Users', serializerSchema).serialize(data);
}

/** 
 * Controller used to sign up a user and send email to verify.
 * @param {String} firstName 
 * @param {String} email 
 * @param {String} password 
 * */ 
const signupController = async (req, res) => {
	let response;
	let {
		firstName,
		email,
		password,
		confirmPassword,
		phone,
		address,
		city,
		state,
		bio,
	} = req.body;

	try {
		if(password !== confirmPassword){
			throw new CommonError(PasswordNotMatchException)
		}

		const Users = new repositories.User(connection);
		const user = await Users.getByEmailRaw(email, false);
		if (user) throw new CommonError(EmailAlreadyExistException);

		const type = DRIVER;
		const hashedPassword = bcrypt.hashSync(password, 10);
		const createdUser = await Users.create(
			firstName, 
			email,
			hashedPassword, 
			phone,
			address,
			city,
			state,
			bio,
			type, 
		);

		const userData = await serialize(createdUser);

		const customResponse = {
			createdUser: userData.data
		}
		response = successResponse('User Data', customResponse);
	}
	catch (err) {
		logError(err);
		response = errorResponse(err);
	}

	res.send(response);
}

router.post('/signup', validator, signupController)

module.exports = router
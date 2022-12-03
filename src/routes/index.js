const android = require('./android')
const system = require('./system/health-check')

const router = require('express').Router()
const { helpers } = require('backend-utility');

const { jwt } = helpers;
const { verifyAuth } = jwt;

router.use('/android', android)
router.use(system)

module.exports = router
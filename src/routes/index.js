
const system = require('./system/health-check')
const buyerAuth = require('./auth/buyer')
const buyerUser = require('./user/buyer')
const buyerItem = require('./item/buyer')

const sellerAuth = require('./auth/seller')
const sellerItem = require('./item/seller')
const sellerUser = require('./user/seller')

const driverAuth = require('./auth/driver')
const driverUser = require('./user/driver')
const driverItem = require('./item/driver')

const adminAuth = require('./auth/admin')
const adminUser = require('./user/admin')
const adminItem = require('./item/admin')

const router = require('express').Router()
const { helpers } = require('backend-utility');
const { verify } = require('jsonwebtoken')

const { jwt } = helpers;
const { verifyAuth } = jwt;

router.use('/buyer/auth', buyerAuth)
router.use('/buyer/user', verifyAuth, buyerUser)
router.use('/buyer/item', verifyAuth, buyerItem)
router.use('/seller/auth', sellerAuth)
router.use('/seller/user', verifyAuth, sellerUser)
router.use('/seller/item', verifyAuth, sellerItem)
router.use('/driver/auth', driverAuth)
router.use('/driver/user', verifyAuth, driverUser)
router.use('/driver/item', verifyAuth, driverItem)
router.use('/admin/auth', adminAuth)
router.use('/admin/user', verifyAuth, adminUser)
router.use('/admin/item', verifyAuth, adminItem)
router.use(system)

module.exports = router
const info = require('./info')
const updateProfile = require('./update-profile')
const userWallet = require('../driver/get-wallet')
const topup = require('./top-up')
const updateLocation = require('./update-location')

module.exports = [
  info,
  updateProfile,
  userWallet,
  topup,
  updateLocation
]
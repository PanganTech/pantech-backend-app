const info = require('./info')
const updateProfile = require('./update-profile')
const userWallet = require('../driver/get-wallet')
const topup = require('./top-up')

module.exports = [
  info,
  updateProfile,
  userWallet,
  topup
]
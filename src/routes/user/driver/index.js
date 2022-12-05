const info = require('./info')
const updateProfile = require('./update-profile')
const userWallet = require('../driver/get-wallet')

module.exports = [
  info,
  updateProfile,
  userWallet,
]
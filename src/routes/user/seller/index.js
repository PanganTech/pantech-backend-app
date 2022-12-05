const info = require('./info')
const updateProfile = require('./update-profile')
const getWallet = require('./get-wallet')
const topup = require('./top-up')

module.exports = [
  info,
  updateProfile,
  getWallet,
  topup
]
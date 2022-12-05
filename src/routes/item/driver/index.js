const confirmPickUp = require('./check-item')
const confirmOtw = require('./confirm-otw')
const confirmDelivered = require('./confirm-delivered')

module.exports = [
    confirmPickUp,
    confirmOtw,
    confirmDelivered
]
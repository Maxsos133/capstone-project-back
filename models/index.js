const { model } = require('mongoose')
const OrderSchema = require('./order')
const UserSchema = require('./user')

const Order = model('Order', OrderSchema)
const User = model('User', UserSchema)

module.exports = {
    Order,
    User
}
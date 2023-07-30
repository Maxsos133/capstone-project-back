const { model } = require('mongoose')
const OrderSchema = require('./order')
const UserSchema = require('./user')
const DressSchema = require('./dress')

const Order = model('Order', OrderSchema)
const User = model('User', UserSchema)
const Dress = model('Dress', DressSchema)

module.exports = {
    Order,
    User,
    Dress
}
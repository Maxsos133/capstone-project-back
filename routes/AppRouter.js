const express = require('express')
const Router = express.Router()
const OrderRouter = require('./ordersRouter')
const UserRouter = require(`./usersRouter.js`)
const DressRouter = require('./dressRouter')

Router.use('/orders', OrderRouter)
Router.use(`/users`, UserRouter)
Router.use('/dress', DressRouter)


module.exports = Router
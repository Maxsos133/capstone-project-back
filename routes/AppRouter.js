const express = require('express')
const Router = express.Router()
const OrderRouter = require('./ordersRouter')
const UserRouter = require(`./usersRouter.js`)

Router.use('/orders', OrderRouter)
Router.use(`/users`, UserRouter)


module.exports = Router
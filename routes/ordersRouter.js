const express = require('express')
const Router = express.Router()
const controller = require('../controllers/orderController')

Router.get('/', controller.getOrders)
Router.get('/:id', controller.getOrdersById)
Router.get('/byBuyerEmail/:buyerEmail', controller.getOrdersByBuyerEmail)

Router.post('/create', controller.createOrder)
Router.patch('/:id', controller.updateOrder)

module.exports = Router
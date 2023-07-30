const express = require('express')
const Router = express.Router()
const controller = require('../controllers/dressController')

Router.get('/', controller.getDress)
Router.get('/:id', controller.getDressById)

Router.post('/create', controller.createDress)
Router.delete('/:id', controller.deleteDressById);

module.exports = Router
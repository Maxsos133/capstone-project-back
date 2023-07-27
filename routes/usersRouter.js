const express = require(`express`)
const Router = express.Router()
const controller = require(`../controllers/userController`)

Router.get(`/`, controller.getUsers)
Router.get(`/:email`, controller.getUsersByEmail)

Router.post('/login', controller.loginUser)
Router.post("/signup", controller.signupUser)

module.exports = Router
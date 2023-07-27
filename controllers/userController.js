const { User } = require(`../models`)
const userSchema = require(`../models/user`)

const getUsers = async (req, res) => {
    const user = await User.find({})
    res.json(user)
}


const getUsersByEmail = async (req, res) => {
    try {
      const { email } = req.params
      let user = await User.findOne({ email: email })
      res.json(user)
    } catch (error) {
      res.send(error)
    }
  }

  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
  
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }
  
      if (user.password !== password) {
        res.status(401).json({ error: 'Invalid credentials' })
        return
      }
  
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  const signupUser = async (req, res) => {
    try {
      const { email, name, password,} = req.body
      const user = await User.findOne({ email })
  
      if (user) {
        res.status(409).json({ error: 'User already exists' })
        return
      }
  
      let newUser = await User.create({
        email,
        name,
        password,
        isAdmin: false
      })
  
      res.json(newUser)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

module.exports = {
    getUsers,
    getUsersByEmail,
    loginUser,
    signupUser
}
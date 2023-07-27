const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    email: { type: String, required: true},
    name: { type: String, required: true},
    password: { type: String, required: true},
    isAdmin: { type: Boolean, required: true}
  },
  { timestamps: true }
)

module.exports = userSchema
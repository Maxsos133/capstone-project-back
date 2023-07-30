const { Schema } = require('mongoose')

const dressSchema = new Schema(
  {
    name: { type: String, required: true},
    image: { type: String, required: true},
    description: { type: String, required: false},
    price: { type: String, required: true}
  },
  { timestamps: true }
)

module.exports = dressSchema
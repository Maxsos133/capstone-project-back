const { Schema } = require('mongoose')

const orderSchema = new Schema(
  {
    buyer: { type: String, required: true},
    size: { type: String, required: true},
    customSize: { type: Array, required: false},
    color: { type: String, required: true},
    status: { type: String, required: true},
    description: { type: String, required: false},
    dress: {type: String, required: true}
  },
  { timestamps: true }
)

module.exports = orderSchema
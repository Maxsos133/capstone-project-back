const { Schema } = require('mongoose')

const orderSchema = new Schema(
  {
    buyer: { type: String, required: true},
    size: { type: String, required: true},
    color: { type: String, required: true},
    fabric: { type: String, required: true},
    status: { type: String, required: true},
    description: { type: String, required: false},
  },
  { timestamps: true }
)

module.exports = orderSchema
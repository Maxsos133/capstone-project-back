const { Order } = require('../models')
const orderSchema = require('../models/order')

const getOrders = async (req, res) => {
    const order = await Order.find({})
    res.json(order)
}

const getOrdersById = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        if(!order) throw Order('order not found')
        res.json(order)
    } catch (e) {
        console.log(e)
        res.send('order not found')
    }
}

const createOrder = async (req, res) => {
    try {
      const { buyerEmail, size, color, description, dress, customSizeValues} = req.body
      
  
      let newOrder = await Order.create({
        buyer: buyerEmail,
        size: size,
        color: color,
        status: 'pending',
        description: description,
        dress: dress,
        customSize: customSizeValues
      })
  
      res.json(newOrder)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  const updateOrder = async (req, res) => {
    try {
      const { id } = req.params
      const { size, color, fabric, status, description } = req.body
  
      let order = await Order.findById(id)
      if (!order) throw Error('Order not found')
  
      if (size) order.size = size
      if (color) order.color = color
      if (fabric) order.fabric = fabric
      if (status) order.status = status
      if (description) order.description = description
  
      await order.save()
  
      res.json(order)
    } catch (error) {
      res.status(404).json({ error: 'Order not found' })
    }
  }

  const getOrdersByBuyerEmail = async (req, res) => {
    try {
      const { buyerEmail } = req.params
      const orders = await Order.find({ buyer: buyerEmail })
      res.json(orders)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }
  
module.exports = {
    getOrders,
    getOrdersById,
    createOrder,
    updateOrder,
    getOrdersByBuyerEmail,
}
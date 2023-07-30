const { Dress } = require('../models')
const dressSchema = require('../models/dress')

const getDress = async (req, res) => {
    const dress = await Dress.find({})
    res.json(dress)
}

const getDressById = async (req, res) => {
    try {
        const { id } = req.params
        const dress = await Dress.findById(id)
        if(!dress) throw Dress('dress not found')
        res.json(dress)
    } catch (e) {
        console.log(e)
        res.send('dress not found')
    }
}

const createDress = async (req, res) => {
    try {
      const { name, image, description, price} = req.body
      
  
      let newDress = await Dress.create({
        name: name,
        image: image,
        description: description,
        price: price
      })
  
      res.json(newDress)
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  const deleteDressById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const dress = await Dress.findById(id);
      if (!dress) {
        return res.status(404).json({ error: 'Dress not found' });
      }
  
      await Dress.findByIdAndDelete(id);
      res.json({ message: 'Dress deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
module.exports = {
    getDress,
    getDressById,
    createDress,
    deleteDressById
}
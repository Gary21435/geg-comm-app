const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const orderSchema = new mongoose.Schema({
    number: Number,
    name: String,
    status: String,
    assembly: Boolean,
    comments: String
})

// modify the 'toJSON' method of the schema to replace _id property with id, and remove __v
orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Order', orderSchema);
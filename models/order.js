const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const orderSchema = new mongoose.Schema({
    number: Number,
    name: String,
    status: String,
    assembly: Boolean,
    comments: String,
    order_id: Number,
    status: String,
    date_created: String,
    payment_method: String,
    custom_status: String,
    first_name: String,
    last_name: String,
    street_1: String,
    street_2: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    email: String,
    items_total: Number,
    fo_last: String
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
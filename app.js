const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const Order = require('./models/order');

const app = express()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const sampleOrder = {
    number: 6252,
    name: 'Jaime Rodriguez',
    status: 'Scheduled',
    assembly: true,
    comments: 'Going to 2nd floor of house.'
}

const newOrder = new Order({...sampleOrder})

newOrder
    .save()
    .then(order => console.log('this the order', order))
    .catch(error => next(error))

app.use(express.static('dist')) // to serve static files, i.e. index.html, .js, etc. in dist
app.use(express.json()) // I guess imports the json() function

app.get('/api/hello', (req, res) => {
    res.send('<h1>Hello World! from the backend.</h1>')
    console.log('hmm...');
})

module.exports = app;
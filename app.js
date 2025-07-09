const express = require('express')
const mongoose = require('mongoose')
const ordersRouter = require('./controllers/orders')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
//const Order = require('./models/order');
const middleware = require('./utils/middleware')
const app = express()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:')
    next(error)
  })

app.use(express.static('dist')) // to serve static files, i.e. index.html, .js, etc. in dist
app.use(express.json()) // I guess imports the json() function

app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;
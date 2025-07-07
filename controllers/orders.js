const ordersRouter = require('express').Router() // a router object is an isolated instance of middleware and routes
const order = require('../models/order')
const Order = require('../models/order') // Mongoose model for talking to mongodb collection ('orders')
require('../utils/middleware') // do i need this?
const logger = require('../utils/logger')
const { STORE_HASH, X_TOKEN } = require('../utils/config')

// BigCommerce base URL
const baseURL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;

ordersRouter.get('/', (req, res) => {
    Order.find({}).then(orders => {
        logger.info('Orders from the DB have arrived!');
        res.json(orders);
    })
    .catch(e => next(e))
})

//ordersRouter.get()

module.exports = ordersRouter;
const ordersRouter = require('express').Router() // a router object is an isolated instance of middleware and routes
const order = require('../models/order')
const Order = require('../models/order') // Mongoose model for talking to mongodb collection ('orders')
const logger = require('../utils/logger')
const { STORE_HASH, X_TOKEN } = require('../utils/config')
const axios = require('axios')


// BigCommerce base URL
const baseURL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;

ordersRouter.get('/', (req, res, next) => {
    Order.find({}).then(orders => {
        logger.info('Orders from the DB have arrived!');
        res.json(orders);
    })
    .catch(e => next(e))
})

ordersRouter.get('/orders10', (req, res, next) => {
    axios.get(`${baseURL}/orders?limit=10&min_id=6243`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': X_TOKEN 
        }
    })
    .then(response => {
      console.log("orders received from BigCommerce API: ", response.data);
      res.send(response.data);
      logger.info(response.data.length)
    })
    .catch(e => next(e));
})

module.exports = ordersRouter;
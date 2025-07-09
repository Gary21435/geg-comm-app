const ordersRouter = require('express').Router() // a router object is an isolated instance of middleware and routes
const Order = require('../models/order') // Mongoose model for talking to mongodb collection ('orders')
const logger = require('../utils/logger')
const { STORE_HASH, X_TOKEN, SECRET } = require('../utils/config')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const order = require('../models/order')

// BigCommerce base URL
const baseURL = `https://api.bigcommerce.com/stores/${STORE_HASH}/v2`;
const baseURL_v3 = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`;
const orders_limit = 3;
let data_array = [];

const getToken = (req) => {
    const token = req.get('authorization');
    if(token && token.startsWith('Bearer ')) {
        return token.replace('Bearer ', '');
    }
    return null;
}

ordersRouter.get('/', async (req, res, next) => {
    const verified = jwt.verify(getToken(req), SECRET);
    if (!verified.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    // if all good, get orders from DB and respond with them
    console.log('TOKEN ALL GOOOD');
    Order.find({}).then(orders => {
        logger.info('Orders from the DB have arrived!');
        res.json(orders);
    })
    .catch(e => next(e))
})

//delete all db
// Order.deleteMany({})
//     .then(logger.info("all db deleted"))

// Helper function to get any additional data from BC
const getData = (url, next) => {
    axios.get(`${url}/orders?limit=10&min_id=6243`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': X_TOKEN 
        }
    })
    .then(response => {return response})
    .catch(error => console.log("error in getData:", error))
}

ordersRouter.get('/orders10', async (req, res, next) => {
  try {
    let orders_array = await axios.get(`${baseURL}/orders?sort=date_created:desc&limit=3`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Auth-Token': X_TOKEN
        }
    });
    orders_array = orders_array.data;
    
    let shipping_info, order_data_additional, fo_last;

    //console.log("orders received from BigCommerce API: ", response.data[0]);
    // Extract data according to orderSchema
    for(let one_order of orders_array) {
        
        const { id, status, date_created, payment_method, shipping_addresses: {url}, custom_status } = one_order;
        const order_id = id;
        let order_data = {order_id, status, date_created, payment_method, custom_status};
        // get shipping address
        shipping_info = await axios.get(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': X_TOKEN 
                }
        })
        shipping_info = shipping_info.data[0];
        const { 
            first_name, 
            last_name, 
            street_1, street_2, city, state, zip, phone,
            email, 
            items_total } = shipping_info;
        order_data_additional = {
            first_name, 
            last_name, 
            street_1, street_2, city, state, zip, phone,
            email, 
            items_total
        }
        logger.info("shipping data:", order_data_additional);
        let all_data = {...order_data, ...order_data_additional};
        // Send to frontend; maybe not even do this, just use this path for getting data from BC and saving it to the db; the other path ('/') already gets all data from DB
        // Get transaction data
        fo_last = await axios.get(`${baseURL_v3}/orders/${id}/transactions`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': X_TOKEN 
                }
        })
        if(fo_last.data.data[0].credit_card) {
            logger.info("fo_last data:", fo_last.data.data[0]);
            fo_last = fo_last.data.data[0].credit_card.card_last4;
            
        }
        else {
            fo_last = "N/A";
        }
        logger.info("fo_last:", fo_last);
        all_data = {...all_data, fo_last};
        data_array.push(all_data);

        

        // save() to DB
        //delete all first:
        // Order.deleteMany({})
        //     .then("all db deleted")
        const orderToDB = new Order({...all_data})
        orderToDB.save()
            .then(r => logger.info("saved to DB"))
            .catch(e => console.log("error!!!!!", e))
        
        // fo_last = res.data[0].credit_card.card_last4
    } 
    logger.info("array of all order data_____________", data_array);
    //   logger.info(response.data.length)
        res.send({all: 'good'});
  }
  catch (error) {
    next(error)
  }
    // .then(() => {
        
    // })
    // .catch(e => next(e));
    
})

// ordersRouter.get('/orders10', (req, res, next) => {
//     axios.get(`${baseURL}/orders?sort=date_created:desc&limit=10`, {
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             'X-Auth-Token': X_TOKEN
//         }
//     })
//     .then(response => {
//         //console.log("orders received from BigCommerce API: ", response.data[0]);
//         // Extract data according to orderSchema
//         for(let i = 0; i < response.data.length; i++) {
          
//             const { id, status, date_created, payment_method, shipping_addresses: {url}, custom_status } = response.data[i];
//             let order_data = {id, status, date_created, payment_method, custom_status};
//             logger.info("order_data:", order_data);
//             // get shipping address
//             let shipping_info, order_data_additional;
//             axios.get(url, {
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//                 'X-Auth-Token': X_TOKEN 
//                 }
//             })
//             .then(shipRes => {
//                 shipping_info = shipRes.data[0];
//                 logger.info("shipping_info:", shipping_info)

//                 const { 
//                     first_name, 
//                     last_name, 
//                     street_1, street_2, city, state, zip, phone,
//                     email, 
//                     items_total } = shipping_info;
//                 order_data_additional = {
//                     first_name, 
//                     last_name, 
//                     street_1, street_2, city, state, zip, phone,
//                     email, 
//                     items_total
//                 }
//                 logger.info("shipping data:", order_data_additional);

//                 //const fo_last = getData(`${baseURL_v3}/orders/${id}/transactions`);
//                 // logger.info("shipping:", shipping_add);
//                 order_data = {...order_data, ...order_data_additional};
//                 logger.info("order_data: ", order_data)
//                 data_array.push(order_data);

                

//                 // save() to DB
//                 // const orderToDB = new Order({...order_data})
//                 // orderToDB.save()
//                 // .catch(e => console.log("error!!!!!", e))
//                 logger.info("data array:", data_array);
//             })
//             .catch(err => next(err));

//             // Send to frontend; maybe not even do this, just use this path for getting data from BC and saving it to the db; the other path ('/') already gets all data from DB
//         } 
//     //   logger.info(response.data.length)
//         res.send({all: 'good'});
        
//     })
//     // .then(() => {
        
//     // })
//     .catch(e => next(e));
    
// })

module.exports = ordersRouter;
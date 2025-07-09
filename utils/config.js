require('dotenv').config()

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const X_TOKEN = process.env.X_TOKEN;
const STORE_HASH = process.env.STORE_HASH;
const SECRET = process.env.SECRET;
const SECRET_CODE_FOR_SIGNUP = process.env.SECRET_CODE_FOR_SIGNUP;

module.exports = { PORT, MONGODB_URI, X_TOKEN, STORE_HASH, SECRET, SECRET_CODE_FOR_SIGNUP }

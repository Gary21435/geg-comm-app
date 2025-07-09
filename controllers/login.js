const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()
const { SECRET } = require('../utils/config')


loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordCorr = user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if(!user) 
        return res.status(401).json({
            error: 'invalid username'
        })
    else if (!passwordCorr) 
        return res.status(401).json({
            error: 'invalid password'
        })

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, SECRET); // generate token using username, id, and my secret env var
    console.log(`You're in, ${user.name}!`);
    res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter;
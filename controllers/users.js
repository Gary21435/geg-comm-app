const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { SECRET_CODE_FOR_SIGNUP } = require('../utils/config')

usersRouter.post('/', async (req, res) => {
    const { username, name, password, sssdass } = req.body;
    // Add a secret code in the request body that you verify here with a .env variable so that anyone making a http post request to this url (when app is deployed) can't create a user
    if(!sssdass || !(sssdass === SECRET_CODE_FOR_SIGNUP)) {
        return res.status(401).json({ error: "you are unauthorized"}).end();
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save();

    res.status(201).json(savedUser);
})

module.exports = usersRouter;
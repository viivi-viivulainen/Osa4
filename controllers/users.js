const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')


//Käyttäjän lisääminen perinteisellä post pyynnöllä
usersRouter.post('/', async (request, response) => {
    //const user = new User(request.body)
    const { username, name, password } = request.body

    const pituus = request.body.password
 
    if (pituus.length < 3) {
        response.status(400).json({ error: 'username and password must be at least 3 charecters long'})
    }

    const saltRounds = 10
    const passHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

//Haetaan kaikki blogit
usersRouter.get('/', async (request, response) => {

    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1, id: 1  })
    response.json(users)

})

module.exports = usersRouter
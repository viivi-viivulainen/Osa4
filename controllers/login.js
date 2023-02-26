const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

//Käyttäjä lähettää kirjautumistiedot palvelimelle
loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    //etsitään käyttäjätunnus
    const user = await User.findOne({ username })

    //jos käyttäjätunnus löytyy  
    //oikea salasana decryptataan ja verrataan käyttäjän syötteeseen
    const passwCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passHash)

    //Mikäli tunnus ja salasana ei mätch niin virheilmo
    if (!(user && passwCorrect)) {
        return response.status(401).json({
            error: 'invalid input'
        })
    }

    //Jos kaikki oikein niin luodaan userToken käyttäen
    //käyttäjätunnusta sekä id:tä
    const userToken = {
        username: user.username,
        id: user._id,
    }

    //metodi, joka luo digitaalisen allekirjoituksen
    //tokenin voi generoida ainoastaan tietämällä userToken
    //muuttujat
    const token = jwt.sign(userToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
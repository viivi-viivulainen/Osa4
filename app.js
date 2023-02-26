//otetaan kaikki tarvittavat kirjastot mukaan
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

require('express-async-errors')

console.log('tänne')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
console.log('tänne asti')
const middleware = require('./utils/middleware')


mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

//app hakee kaikki blogit antaen polin ja käyttäen blogsRouteria, joka luodaan
//controllers/blogs kansiossa
app.use('/api/blogs', blogsRouter)

//huolehtii /api/users/ pyynnöistä
app.use('/api/users', usersRouter)

//huolehtii /api/login/ pyynnöistä
app.use('/api/login', loginRouter)

//Palauttaa unknown endpointin, mikäli polku ei johda mihinkään
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
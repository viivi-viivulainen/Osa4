const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')


app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})

/*
//const http = require('http')
const express = require('express')
const app = express()
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})


const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')
const config = require('./utils/config')
const Blog = require('./models/blog')

//Jotta frontend pääsee kiinni backendiin
app.use(cors())


//loggeri käyttöön
app.use(morgan('tiny'))

//Jotta päästään dataan kiinni
app.use(express.json())

//staattisen sisällön esittämiseen
app.use(express.static('build'))

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

const PORT = 3003
app.listen(PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
}) */
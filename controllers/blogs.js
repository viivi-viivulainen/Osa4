const blogsRouter = require('express').Router()
//const { request, response } = require('../app')'
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/users')
//console.log(Blog)


//Eristetään authorization headeristä
const getToken = request => {
    const authorization = request.get('authorization')
    //console.log(authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
        console.log(authorization.replace('Bearer ', ''))
        return authorization.replace('Bearer ', '')
    }
    
    return null
}
//console.log(getToken)
//console.log(jwt)

//Haetaan kaikki blogit
blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
    /* vanha toteutus
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        }) */
})

//Lisätään uusi blogi
blogsRouter.post('/', async (request, response) => {
    //const blog = new Blog(request.body)
    const body = request.body

    console.log('ennen dekoodaamista')
    //console.log(jwt.verify(getToken(request), process.env.SECRET))

    //Dekoodataan token
    const decodToken = jwt.verify(getToken(request), process.env.SECRET)

    console.log('dekoodin jälkeen')
    console.log(decodToken.id)

    //Jos token ei vastaa sitä mitä pitäisi, tulee virheilmo
    if (!decodToken.id) {
        return response.status(401).json({ error: 'Id not defined. Token invalid' })
    }
    const user = await User.findById(decodToken.id) 

    //const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)

    /*
    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch(exception) {
        next(exception)
    } */

/* Vanha toteutus
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })*/
}) 



//Tarkastellaan yhtä blogia
blogsRouter.get('/:id', async (request, response) => {

    const blog = await Blog.findById(request.params.id)
    if (Blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }

})

//poistetaan blogilainen
blogsRouter.delete('/:id', async (request,response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()

})



module.exports = blogsRouter
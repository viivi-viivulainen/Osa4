const Blog = require('../models/blog')
const User = require('../models/users')

//Alustetaan tietokantaan blogeja
const initialBlogs = [
    {
        title: 'Blogi',
        author: 'Venla',
        url: 'joku/kiva',
        likes: 1000
    },
    {
        title: 'Blogilainen',
        author: 'Pesusieni',
        url: 'tangala/blogi',
        likes: 100
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb
}
  
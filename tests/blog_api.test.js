const mongoose = require('mongoose')
const supertest = require('supertest')
const help = require('./test_helpo')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/users')

const api = supertest(app)
const Blog = require('../models/blog')

//Alustetaan tietokantaan blogeja
beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('DB clear')

    //await Blog.insertMany(help.initialBlogs)
    let noteObject = new Blog(help.initialBlogs[0])
    await noteObject.save()

    noteObject = new Blog(help.initialBlogs[1])
    await noteObject.save()

})

//Testataan, että blogit palautuvat jsoneina
test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

//Testataan, että blogien muoto on oikein ja niitä on oikea määrä
test('there are two blog posts and they are json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
  
    //expect(response.body).toHaveLength(2)
    expect(response.body).toHaveLength(help.initialBlogs.length)
})
  
//Tarkistetaan löytyykö blogien authoreista Pesusieni
test('One of the blogs authors is Pesusieni', async () => {
    const response = await api.get('/api/blogs')

    const authori = response.body.map(r => r.author)
    expect(authori).toContain('Pesusieni')
    //expect(response.body[0].author).toBe('Venla')
})

//Testataan, että id on määritelty
test('Id is defined', async () => {
    const response = await api.get('/api/blogs')
    const idt = response.body.map(r => r.id)

    expect(idt).toBeDefined()
})

//Testataan, että uusi blogi menee tietokantaan sujuvasti
test('Blog adding', async () => {
    const newBlog = {
        title: 'Ruuumaa',
        author: 'Patric Tähtönen',
        url: 'tangala/kivi',
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    //const response = await api.get('/api/blogs')
    const blogs = await help.blogsInDb()

    //const titles = response.body.map(r => r.title)
    const titles = blogs.map(n => n.title)

    expect(blogs).toHaveLength(help.initialBlogs.length + 1)
    expect(titles).toContain('Ruuumaa')
})

//Testataan blogin poistoa
test('Removing blog', async () => {
    const blogsFirst = await help.blogsInDb()
    const blogDel = blogsFirst[0]

    await api
        .delete(`/api/blogs/${blogDel.id}`)
        .expect(204)

    const blogLast = await help.blogsInDb()

    expect(blogLast).toHaveLength(
        help.initialBlogs.length - 1
    )

    const titles = blogLast.map(r => r.title)
    expect(titles).not.toContain(blogDel.title)
})


//Tehdään testit käyttäjälle
describe('One user in database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passHash = await bcrypt.hash('roottisalis', 10)
        const user = new User({ username: 'root', passHash })

        await user.save()
    })

    test('New user added :)', async () => {
        const usersFirst = await help.usersInDb()

        const uusiKayttaja = {
            username: 'Patrik_on_paras',
            name: 'Patrik Tähtönen',
            password: 'enkerron'
        }

        await api
            .post('/api/users')
            .send(uusiKayttaja)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await help.usersInDb()
        expect(usersAfter).toHaveLength(usersFirst.length + 1)

        const names = usersAfter.map(u => u.username)
        expect(names).toContain(uusiKayttaja.username)
    })
})


//Tehdään testi, ettei liian lyhyt salasana mene kantaan
test('Only valid users to database', async () => {
    const usersFirst = await help.usersInDb()

    const uusiKayttaja = {
        username: 'Patrik_on_ihan_ok',
        name: 'Patrik Tähtönen',
        password: 'en'
    }

    await api
        .post('/api/users')
        .send(uusiKayttaja)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    const usersAfter = await help.usersInDb()
    expect(usersAfter).toHaveLength(usersFirst.length)

    const names = usersAfter.map(u => u.username)
    expect(names).not.toContain(uusiKayttaja.username)

})

//Tehdään testi, ettei samoja käyttäjätunnuksia mene kantaan muodostetut käyttäjät mene kantaan
test('Only unique users to database', async () => {
    const usersFirst = await help.usersInDb()

    const uusiKayttaja = {
        username: 'Patrik_on_paras',
        name: 'Patrik Tähtönen',
        password: 'ensimmainen'
    }

    await api
        .post('/api/users')
        .send(uusiKayttaja)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    const usersAfter = await help.usersInDb()
    expect(usersAfter).toHaveLength(usersFirst.length)

    const names = usersAfter.map(u => u.username)
    expect(names).toContain(uusiKayttaja.username)

})

afterAll(async () => {
    await mongoose.connection.close()
})
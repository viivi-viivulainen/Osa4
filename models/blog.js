const mongoose = require('mongoose')

//mongoose.set('strictQuery', false)

//Luodaan blogille skeema/runko
//Lisäksi palautetaan jsonina ja postetaan _id sekä __v näkyvistä
//25.2. lisätty tieto blogin lisänneestä käyttäjästä
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
  
//const Blog = mongoose.model('Blog', blogSchema)
  
//const mongoUrl = process.env.MONGODB_URI
//mongoose.connect(mongoUrl)

module.exports = mongoose.model('Blog', blogSchema)
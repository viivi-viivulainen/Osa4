//Luodaan käyttäjä blogin tapaan
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Luodaan käyttäjän skeema johon sisällytettään taulukko 
//käyttäjän blogien id:stä
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlenght: 3},
    name: String,
    passHash: {
        type: String,
        required: true},
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

userSchema.plugin(uniqueValidator)

//Luodaan käyttäjän skeema, josta id, salasana ja __v piilotettu
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        //delete returnedObject._id
        delete returnedObject.__v
        //salasana piiloon
        delete returnedObject.passHash
    }
})

//luodaan käyttäjä määritellystä skeemasta
const User = mongoose.model('User', userSchema)

module.exports = User
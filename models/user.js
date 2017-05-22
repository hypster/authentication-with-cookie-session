const mongoose = require('mongoose')
const User = mongoose.model('User', mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
}))
module.exports = User
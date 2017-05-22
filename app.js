const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/usertest')

const User = require('./models/user')

const app = require('express')()

require('./lib/config')(app)

require('./lib/middleware')(app)

app.use(addUser)

//add user to req if session user exist
function addUser(req, res, next) {
    if (req.mySession.user) {
        User.findOne({username: req.mySession.user.username}, (err, user) => {
            if(err) 
                res.redirect('/')
            if (!user) {
                req.mySession = {}
                next()
            }
            else {
                req.user = user
                next()
            }
        })
    } else {
        next()
    }
}

const userRoute = require('./routes/user')

app.use(userRoute)

app.listen(3333)
console.log('listen on 3333')


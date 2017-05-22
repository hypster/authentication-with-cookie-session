const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/usertest')

const User = require('./models/user')

const app = require('express')()

require('./lib/config')(app)

require('./lib/middleware')(app)

app.use(addUser)

//add user to req if session user exist
function addUser(req, res, next) {
    if (req.session.user) {
        User.findOne({username: req.session.user.username}, (err, user) => {
            if(err) 
                res.redirect('/')
            if (!user) {
                req.session = {}
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


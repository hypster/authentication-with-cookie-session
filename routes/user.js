const app = new require('express').Router()
const bcypt = require('bcrypt')
const User = require('../models/user')

function checkUser(req, res, next) {
    console.log(`check.user ${req.user}`)
    if (req.user)
        next()
    else 
        res.redirect('/login')
}


app.get('/', (req, res) => {
    res.render('index')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', (req, res) => {
    // res.json(req.body)
    let password = req.body.password
    let username = req.body.username
    if (!password || !username) 
        return res.render('login', {message: 'username and password are required'})
    User.findOne({username}, (err, user) => {
        if (err)
            return res.render('login', {message: 'internal error'})
        if (!user)
          return res.render('login', {message: 'username not correct'})
        if (!bcypt.compareSync(password, user.password))
            return res.render('login', {message:'password not correct'})
        req.mySession.user = user
        delete req.mySession.user.password
        res.redirect('/')
    })
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/signup', (req, res) => {
    // res.json(req.body)
    let username = req.body.username
    let password = req.body.password
    if (!username || !password) {
        res.render('signup', {message: 'username and password must be filled'})
    }
    User.findOne({username: username}, (err, user) => {
        if (err)
            res.render('signup', {message: 'internal error'})
        if (user)
            res.render('signup', {message: 'user already exist'})
        else {
            let user = new User()     
            user.password = bcypt.hashSync(password, bcypt.genSaltSync(10))
            user.username = username
            user.save((err) => {
                if (err) {
                    res.redirect('/login')
                }
                req.mySession.user = user
                res.redirect('/')
            })
        }
    })  
})
app.get('/dashboard', checkUser, (req, res) => {
    res.render('dashboard', {user: req.user})
})

app.get('/logout', (req, res) => {
    req.mySession.user = {}
    res.redirect('/')
})

module.exports = app
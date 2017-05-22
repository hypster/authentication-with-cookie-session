const app = new require('express').Router()
const bcypt = require('bcrypt')
const User = require('../models/user')

function checkUser(req, res, next) {
    console.log(`check.user ${req.user}`)
    if (req.user)
        next()
    else {
        req.flash('info','please login first')
        res.redirect('/login')
    }
        
}


app.get('/', (req, res) => {
    res.render('index')
})
app.get('/login', (req, res) => {
    res.render('login', {msgs: req.flash('info')})
})
app.post('/login', (req, res) => {
    // res.json(req.body)
    let password = req.body.password
    let username = req.body.username
    if (!password || !username) {
        req.flash('info', 'username and password are required')
        return res.redirect('/login')
    }
    User.findOne({username}, (err, user) => {
        if (err) {
            req.flash('info', 'internal error')
            return res.redirect('/login')
        }
        if (!user) {
            req.flash('info', 'username not correct')
            return res.redirect('/login')
        }
        if (!bcypt.compareSync(password, user.password)) {
            req.flash('info', 'password not correct')
            return res.redirect('/login')
        } else {
            req.session.user = user
            delete req.session.user.password
            return res.redirect('/dashboard')
        }
    })
})
app.get('/signup', (req, res) => {
    res.render('signup', {msgs: req.flash('info')})
})
app.post('/signup', (req, res) => {
    // res.json(req.body)
    let username = req.body.username
    let password = req.body.password
    if (!username || !password) {
        req.flash('info', 'username and password must be filled')
        return res.redirect('/signup')
    }
    User.findOne({username: username}, (err, user) => {
        if (err) {
            req.flash('info', 'internal error')
            return res.redirect('/signup')
        }
        if (user) {
            req.flash('info', 'user already exist')
            return res.redirect('/signup')
        }
        else {
            let user = new User()     
            user.password = bcypt.hashSync(password, bcypt.genSaltSync(10))
            user.username = username
            user.save((err) => {
                if (err) {
                    req.flash('info', 'internal error')
                    return res.redirect('/login')
                }
                req.session.user = user
                return res.redirect('/dashboard')
            })
        }
    })  
})
app.get('/dashboard', checkUser, (req, res) => {
    res.render('dashboard', {user: req.user})
})

app.get('/logout', (req, res) => {
    req.session.user = {}
    res.redirect('/')
})

module.exports = app
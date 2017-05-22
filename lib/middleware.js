const bcypt = require('bcrypt')
const sessions = require('client-sessions')

module.exports = function (app) {    
    app.use(require('morgan')('dev'))
    app.use(require('body-parser').urlencoded({extended: true}))
    app.use(sessions({
        cookieName: 'mySession', // cookie name dictates the key name added to the request object
        secret: 'blargadeeblargblarg', // should be a large unguessable string
        duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 1000 * 60 * 5,// if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        cookie: {
            path: '/', // cookie will only be sent to requests under '/api'
            ephemeral: false, // when true, cookie expires when the browser closes
            httpOnly: true, // when true, cookie is not accessible from javascript
            secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
        }
    }));
}
'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const secreto = require('./secreto')

/**
 * Creates the token for the user
 * @param {UserModel} user
 */
function createToken (user) {
    let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }
    return jwt.encode(payload, secreto.secreto())
}
/**
 * Allow access to the routes of the app n.n
 * @param {request} req receiving stuff
 * @param {response} res returning stuff
 * @param {allows} next call next thingy
 */
function auth (req, res, next) {
    if (!req.headers.authorization) return res.status(403).send({ message: 'LogIn First' })
    let token = null
    let payload = null
    try {
        token = req.headers.authorization.replace(/['"]+/g, '')
        payload = jwt.decode(token, secreto.secreto())
        if (payload.exp <= moment().unix()) return res.status(401).send({ message: 'Expired token' })
    } catch(err) { return res.status(404).send({ message: 'Incalid token' }) }
    req.user = payload
    next()
}
module.exports = { createToken, auth }
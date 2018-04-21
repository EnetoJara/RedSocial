'use strict'

const express = require('express')
const controller = require('../controllers/userController')
const auth = require('../services/token')
const api = express.Router()
const multiPart = require('connect-multiparty')
const uploads = multiPart({ uploadDir: './uploads/users' })

api.get('/home', controller.home)
api.post('/register', controller.save)
api.post('/login', controller.logIn)
api.get('/user/:id', [ auth.auth ], controller.getUser)
api.get('/users/:page?', [ auth.auth ], controller.getUsers)
api.put('/update/:id', [ auth.auth ], controller.update)
api.post('/uploadImage/:id', [ auth.auth, uploads ], controller.uploadImage)
api.get('/getImage/:imageFile', controller.getImageFile)
api.get('/counters/:id?', [ auth.auth ], controller.getCounters)

module.exports = api
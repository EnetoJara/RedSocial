'use strict'

const controller = require('../controllers/publicationController')
const auth = require('../services/token')
const api = require('express').Router()
const multiPart = require('connect-multiparty')
const uploads = multiPart({ uploadDir: './uploads/publications' })

api.post('/publication', [ auth.auth ], controller.save)
api.get('/publication/:id', [ auth.auth ], controller.getPublication)
api.get('/publications/:page?', [ auth.auth ], controller.getPublications)
api.delete('/publication/:id', [ auth.auth ], controller.deletePublication)
api.post('/uploadImage/:id', [ auth.auth, uploads ], controller.uploadImage)
api.get('/getImage/:imageFile', controller.getImageFile)

module.exports = api
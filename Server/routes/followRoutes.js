'use strict'

const express = require('express')
const controller = require('../controllers/followController')
const auth = require('../services/token')
const api = express.Router()

api.post('/follow', [ auth.auth ], controller.saveFollow)
api.delete('/follow/:id', [ auth.auth ], controller.deleteFollow)
api.get('/following/:id?/:page?', [ auth.auth ], controller.getFollowingUsers)
api.get('/followed/:id?/:page?', [ auth.auth ], controller.getFollowedUsers)
api.get('/getFollows/:followed?', [ auth.auth ], controller.getMyFollows)

module.exports = api
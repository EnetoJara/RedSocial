'use strict'

const controller = require('../controllers/messageController')
const auth = require('../services/token')
const api = require('express').Router()

api.post('/message', [ auth.auth ], controller.save)
api.get('/messages/:page?', [ auth.auth ], controller.listMessages)
api.get('/sendMessages/:page?', [ auth.auth ], controller.listSendMessages)
api.get('/unviewdMessages', [ auth.auth ], controller.unviewedMessages)
api.get('/setUnviewdMessages', [ auth.auth ], controller.setViewedMessages)

module.exports = api
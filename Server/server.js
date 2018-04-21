'use strict'

const express = require('express')
const bodyParse = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const followRoutes = require('./routes/followRoutes')
const publicationRoutes = require('./routes/publicationRoutes')
const messageRoutes = require('./routes/messageRoutes')
const server = express()

server.use(bodyParse.json({ limit: '15mb' }))
server.use(bodyParse.urlencoded({ extended: false }))
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
})

server.use('/api/user', userRoutes)
server.use('/api/follow', followRoutes)
server.use('/api/publication', publicationRoutes)
server.use('/api/message', messageRoutes)

module.exports = server
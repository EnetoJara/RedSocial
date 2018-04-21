'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = mongoose.model('follow', Schema({
    user: { type: Schema.ObjectId, ref: 'user' },
    followed: { type: Schema.ObjectId, ref: 'user' }
}))
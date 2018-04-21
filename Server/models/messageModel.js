'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = mongoose.model('message', Schema({
    text: String,
    viewed: Number,
    created_at: String,
    emmiter: { type: Schema.ObjectId, ref: 'user' },
    receiver: { type: Schema.ObjectId, ref: 'user' }
}))
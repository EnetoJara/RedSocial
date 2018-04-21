'use strict'

const moment = require('moment')
const mongoosePaginate = require('mongoose-pagination')
const User = require('../models/userModel')
const Follow = require('../models/followModel')
const Message = require('../models/messageModel')

/**
 * this method saves a message
 * @param { request } req rreceiving stuff
 * @param { response } res returning stuff
 */
function save (req, res) {
    let params = req.body
    let message = new Message()
    if (!params.text || !params.receiver) return res.status(404).send({ message: 'Missing information' })
    message.emitter = req.user.sub
    message.receiver = params.receiver
    message.text = params.text
    message.created_at = moment().unix()
    message.viewed = 0
    message.save((err, stored) => {
        if (err) return res.status(500).send({ message: 'ERROR SAVING MESSAGE' })
        else if (!stored) return res.status(404).send({ message: 'Message was not saved' })
        else return res.status(200).send({ message: stored })
    })
}
/**
 * returns the list of messages a user has
 * @param {request } req receiving stuff
 * @param { respone } res returning stuff
 */
function listMessages (req, res) {
    let userID = req.user.sub
    let page = (req.params.page && !isNaN(req.params.page)) ? req.params.page : 1
    let itemsPerPage = 5
    Message.find({ receiver: userID }).populate('emitter', '_id name surname nick image')
    .paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'ERROR listing messages' })
        else if (err) return res.status(404).send({ message: 'no messages' })
        else return res.status(200).send({ total: total, pages: Math.ceil(total/itemsPerPage), messages: messages })
    })
}
/**
 * returns the list of messages a user sended
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function listSendMessages (req, res) {
    let userID = req.user.sub
    let page = (req.params.page && !isNaN(req.params.page)) ? req.params.page : 1
    let itemsPerPage = 5
    Message.find({ emitter: userID }).populate('emitter receiver', '_id name surname nick image')
    .paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'ERROR listing messages' })
        else if (err) return res.status(404).send({ message: 'no messages' })
        else return res.status(200).send({ total: total, pages: Math.ceil(total/itemsPerPage), messages: messages })
    })
}
/**
 * returns the list of unviwed messages the user has
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function unviewedMessages (req, res) {
    let userID = req.user.sub
    Message.count({ receiver: userID, viewed: 0 }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'ERROR getting count of messages' })
        else return res.status(200).send({ unviewed: count })
    })
}
/**
 * set the message as viewed
 * @param { request } req retceiving stuff
 * @param { response } res returning stuff
 */
function setViewedMessages (req, res) {
    let userID = req.user.sub
    Message.update({ receiver: userID, viewed: 0 }, { viewed: 1 }, { multi: true }, (err, updated) => {
        if (err) return res.status(500).send({ message: 'ERROR getting count of messages' })
        else return res.status(200).send({ message: updated })
    })
}

module.exports = {
    save, listMessages, listSendMessages,
    unviewedMessages, setViewedMessages
}
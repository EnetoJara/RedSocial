'use strict'

const mongoosePagniate = require('mongoose-pagination')
const User = require('../models/userModel')
const Follow = require('../models/followModel')

/**
 * saves a following
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function saveFollow(req, res) {
    let follow = new Follow()
    let params = req.body
    follow.user = req.user.sub
    follow.followed = params.followed
    follow.save((err, stored) => {
        if (err) return res.status(500).send({ message: 'ERROR SAVING FOLLOWING' })
        else if (!stored) return res.status(404).send({ message: 'the following was not saved' })
        else return res.status(200).send({ follow: stored })
    })
}
/**
 * deletes a follow
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function deleteFollow(req, res) {
    let userID = req.user.sub
    let followID = req.params.id
    Follow.find({ 'user': userID, 'followed': followID }).remove(err => {
        if (err) return res.status(500).send({ message: 'ERROR DELETING FOLLOWING' })
        else return res.status(200).send({ message: 'follow was deleted' })
    })
}
/**
 * returns a list of users we're following
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getFollowingUsers(req, res) {
    let userID = (req.params.id && req.params.page) ? req.params.id : req.user.sub
    let page = (req.params.page && !isNaN(req.params.page)) ? req.params.page : req.params.id
    let itemsPerPage = 5
    Follow.find({ user: userID }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'ERROR GETTING FOLLOWER' })
        else if (!follows)
            if (err) return res.status(404).send({ message: 'Not popular' })
            else return res.status(200).send({ total: total, pages: Math.ceil(total / itemsPerPage), follows: follows })
    })
}
/**
 * return the list of users we follow
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getFollowedUsers(req, res) {
    let userID = (req.params.id && req.params.page) ? req.params.id : req.user.sub
    let page = (req.params.page && !isNaN(req.params.page)) ? req.params.page : req.params.id
    let itemsPerPage = 5
    Follow.find({ followed: userID }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'ERROR GETTING FOLLOWER' })
        else if (!follows)
            if (err) return res.status(404).send({ message: 'Not popular' })
            else return res.status(200).send({ total: total, pages: Math.ceil(total / itemsPerPage), follows: follows })
    })
}
/**
 * this method return the follows
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getMyFollows(req, res) {
    let search = (req.params.followed) ? req.params.followed : req.user.sub
    let find = Follow.find({ user: userID })
    Follow.find({ user: search }).populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'ERROR GETTING FOLLOWER' })
        else if (!follows)
            if (err) return res.status(404).send({ message: 'Not popular' })
            else return res.status(200).send({ follows: follows })
    })
}

module.exports = { saveFollow, deleteFollow, getFollowingUsers, getFollowedUsers, getMyFollows }
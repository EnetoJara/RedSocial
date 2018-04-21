'use strict'

const User = require('../models/userModel')
const bcrypt = require('bcrypt-nodejs')
const token = require('../services/token')
const mongoosePaginate = require('mongoose-pagination')
const multipart = require('connect-multiparty')
const upload = multipart({ uploadDir: './uploads/users' })
const fs = require('fs')
const path = require('path')
const Follow = require('../models/followModel')
const Publication = require('../models/publicationModel')

/**
 * sends you to the home page
 * @param {request} req receiving stuff
 * @param {response} res returning stuff
 */
function home(req, res) {}

/**
 * saving new users
 * @param {request} req receiving stuff
 * @param {response} res returning stuff
 */
function save(req, res) {
    let user = new User()
    let params = req.body
    if (params.name && params.surname && params.nick && params.password && params.email) {
        user.name = params.name
        user.email = params.email
        user.surname = params.surname
        user.nick = params.nick
        user.role = 'ROLE_USER'
        user.image = null
    } else return res.status(300).send({ message: 'Missing INFO' })
    User.find({ email: user.email.toLowerCase() }).exec((err, users) => {
        if (err) return res.status(500).send({ message: 'ERROR GETTING USERS WIHT EMAIL: ' + params.email })
        else if (users && users.length > 0) return res.status(403).send({ message: 'THIS USER IS ALREADY IN USE: ' + params.email })
        bcrypt.hash(params.password, null, null, (err, hashed) => {
            if (err) return res.status(500).send({ message: 'ERROR encripting password' })
            user.password = hashed
            user.save((err, stored) => {
                if (err) return res.status(500).send({ message: 'ERROR Inserting User' })
                else if (!stored) return res.status(404).send({ message: 'User Was not saved' })
                else return res.status(200).send({ user: stored })
            })
        })
    })
}
/**
 * allow the user to inside the app
 * @param {request} req receiving stuff
 * @param {response} res returning stuff
 */
function logIn(req, res) {
    let params = req.body
    if (params.email && params.password) {
        User.findOne({ email: params.email }).exec((err, stored) => {
            if (err) return res.status(500).send({ message: 'ERROR SEARCHING FOR EMAIL: ' + params.email })
            if (!stored) return res.status(404).send({ message: 'There is no registered user with such email: ' + params.email })
            bcrypt.compare(params.password, stored.password, (err, check) => {
                stored.password = undefined
                if (err) return res.status(500).send({ message: 'ERROR COMPARING PASSWORD' })
                else if (!check) return res.status(401).send({ message: 'password is not valid' })
                else if (params.getToken) return res.status(200).send({ token: token.createToken(stored) })
                else return res.status(200).send({ user: stored })
            })
        })
    } else return res.status(401).send({ message: 'There is some missing information' })
}
/**
 * pull from DB the user 
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getUser(req, res) {
    let userID = req.params.id
    User.findById(userID, (err, user) => {
        if (err) return res.status(500).send({ message: 'ERROR getting User' })
        if (!user) return res.status(404).send({ message: 'not such a user' })
        return followThisUser(req.user.sub, userID).then(value => res.status(200).send({ user: user, following: value.following, followed: value.followed }))
    })
}
/**
 * Checks if the user is following me or Im following him
 * @param {logedUse} identityID 
 * @param {URLparameter} userID 
 */
const followThisUser = async(identityID, userID) => {
    let following = null
    let followed = null
    try {
        following = await Follow.find({ 'user': identityID, 'followed': userID }).exec()
            .then(following => following).catch(err => handleError(err))
        followed = await Follow.find({ 'user': userID, 'followed': identityID })
            .then(followed => followed).catch(err => handleError(err))
    } catch (err1) { return handleError(err) }
    return { following: following, followed: followed }
}

/**
 * return a list of users
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getUsers(req, res) {
    let idUser = req.user.sub
    let page = (req.params.page && !isNaN(req.params.page)) ? req.params.page : 1
    let itemsPerPage = 5
    User.find().sort('id').paginate(page, itemsPerPage, (err, users, totalRows) => {
        if (err) return res.status(500).send({ message: 'ERROR getting Users' })
        else if (!users) return res.status(404).send({ message: 'Not Users' })
        return followUsersIDs(idUser).then(value => res.status(200).send({ total: totalRows, pages: Math.ceil(totalRows / itemsPerPage), users: users, usersFollowing: value.following, usersFollowMe: value.followed }))
    })
}

/**
 * edits info of an user
 * @param { request } req receiving stuff
 * @param { response } res retuning stuff
 */
function update(req, res) {
    let userID = req.params.id
    let update = req.body
    delete update.password
    if (userID !== req.user.sub) return res.status(403).send({ message: 'Action denied' })
    User.findOne({ email: update.email }).exec((err, stored) => {
        if (err) return res.status(500).send({ message: 'ERROR UPDATING USER' })
        else {
            if (stored && stored.id !== update._id) return res.status(403).send({ message: 'Action Denied' })
            User.findByIdAndUpdate(userID, update, { new: true }, (err, updated) => {
                if (err) return res.status(500).send({ message: 'ERROR UPDATING USER' })
                else if (!updated) return res.status(404).send({ message: 'not updated' })
                else return res.status(200).send({ user: updated })
            })
        }
    })
}

function getCounters(req, res) {
    let userID = (req.params.id) ? req.params.id : req.user.sub
    return getCountFollow(userID).then(value => res.status(200).send({ following: value.following, followed: value.followed, publications: value.publications }))
}

/**
 * this file updates the profile picture of the user
 * NOTE: If your running this program on windows change the split for // instead of \\ as im doing on mac n.n
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function uploadImage(req, res) {
    let userID = req.params.id
    if (userID !== req.user.sub) return removeFiles(filePath, res, 'Action denied')
    if (!req.files) return res.status(200).send({ message: 'There is no Files' })
    let filePath = req.files.image.path
    let fileSplit = filePath.split('\/')
    let fileName = fileSplit[2]
    let ext = fileName.split('\.')
    let fileExpt = ext[1]
    if (fileExpt === 'png' || fileExpt === 'jpg' || fileExpt === 'jpeg' || fileExpt === 'gif') {
        User.findByIdAndUpdate(userID, { image: fileName }, { new: true }, (err, updated) => {
            if (err) return res.status(500).send({ message: 'ERROR UPDATING USER' })
            else if (!updated) return res.status(404).send({ message: 'not updated' })
            else return res.status(200).send({ user: updated })
        })
    } else return removeFiles(filePath, res, 'Extention not valid')
}
/**
 * the turns the image of the user
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getImageFile(req, res) {
    let imageFile = req.params.imageFile
    let pathFile = './uploads/users/' + imageFile
    fs.exists(pathFile, exists => {
        if (exists) return res.sendFile(path.resolve(pathFile))
        else return res.status(200).send({ message: 'there is no File' })
    })
}

//***********************************************//
//*********** NON EXPORTED SECTION **************//
//***********************************************//
const removeFiles = (filePath, res, message) => {
    fs.unlink(filePath, (err) => res.status(403).send({ message: message }))
}

const getCountFollow = async(userID) => {
    let following = 0
    let followed = 0
    let publications = 0
    try {
        following = await Follow.count({ user: userID })
            .exec().then(count => count).catch(err => handleError(err))
        followed = await Follow.count({ followed: userID })
            .exec().then(cont => cont).catch(err2 => handleError(err2))
        publications = await Publication.count({ 'user': userID })
            .exec().then(count => count).catch(err4 => handleError(err4))
    } catch (err1) { return handleError(err1) }
    return { following, followed, publications }
}

const followUsersIDs = async(userID) => {
    var following = null
    var followed = null
    var cFollowing = []
    var cFollowed = []
    try {
        following = await Follow.find({ user: userID }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec()
            .then(follows => follows).catch(err => handleError(err))
        followed = await Follow.find({ followed: userID }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec()
            .then(follows1 => follows1).catch(err => handleError(err))
    } catch (err) { return handleError(err) }
    following.forEach(element => {
        cFollowing.push(element.followed)
    })
    followed.forEach(element => {
        cFollowed.push(element.user)
    })
    return { following: cFollowing, followed: cFollowed }
}

module.exports = {
    home,
    save,
    logIn,
    getUser,
    getUsers,
    update,
    uploadImage,
    getImageFile,
    getCounters
}
'use strict'

const path = require('path')
const fs = require('fs')
const moment = require('moment')
const mongoosePaginate = require('mongoose-pagination')
const Publication = require('../models/publicationModel')
const User = require('../models/userModel')
const Follow = require('../models/followModel')
    /**
     * saves a post into the DB
     * @param { request } req receibing stuff
     * @param { response } res returning stuff
     */
function save(req, res) {
    let publication = new Publication()
    let params = req.body
    if (!params.text) return res.status(404).send({ messae: 'must send a message' })
    publication.text = params.text
    publication.file = null
    publication.user = req.user.sub
    publication.created_at = moment().unix()
    publication.save((err, stored) => {
        if (err) return res.status(500).send({ message: 'Server Error' })
        else if (!stored) return res.status(404).send({ message: 'publication was not saved' })
        else return res.status(200).send({ publication: stored })
    })
}
/**
 * returns the user's publications
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getPublications(req, res) {
    let page = (req.params.page && !isNaN(req.params.page)) ? req.params.page : 1
    let itemsPerPage = 5
    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Server Error' })
        let fClean = []
        follows.forEach(f => fClean.push(f.followed))
        fClean.push(req.user.sub)
        Publication.find({ user: { '$in': fClean } }).sort('-created_at').populate('user')
            .paginate(page, itemsPerPage, (err, p, total) => {
                if (err) return res.status(500).send({ message: 'Server Error' })
                else if (!p) return res.status(404).send({ message: 'there is no publications' })
                else return res.status(200).send({ itemsPerPage: itemsPerPage, total: total, publications: p, pages: Math.ceil(total / itemsPerPage), page: page })
            })
    })
}
/**
 * this method returns an stecific publication by its id
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function getPublication(req, res) {
    let pID = req.params.id
    Publication.findById(pID, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Server Error' })
        else if (!publication) return res.status(404).send({ message: 'THere is no publication' })
        else return res.stauts(200).send({ publication: publication })
    })
}
/**
 * this methods delete a publication by its id
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function deletePublication(req, res) {
    let id = req.params.id
    Publication.find({ 'user': req.user.sub, '_id': id }).remove(err => {
        if (err) return res.status(500).send({ message: 'Server Error' })
        else return res.status(200).send({ publication: 'Publication Deleted' })
    })
}

/**
 * this file updates the profile picture of the user
 * NOTE: If your running this program on windows change the split for // instead of \\ as im doing on mac n.n
 * @param { request } req receiving stuff
 * @param { response } res returning stuff
 */
function uploadImage(req, res) {
    let publicationID = req.params.id
    if (!req.files) return res.status(200).send({ message: 'There is no Files' })
    let filePath = req.files.image.path
    let fileSplit = filePath.split('\\')
    let fileName = fileSplit[2]
    let ext = fileName.split('\.')
    let fileExpt = ext[1]
    if (fileExpt === 'png' || fileExpt === 'jpg' || fileExpt === 'jpeg' || fileExpt === 'gif') {
        Publication.findOne({ 'user': req.user.sub, '_id': publicationID }).exec((err, publication) => {
            if (err) return res.status(500).send({ message: 'ERROR' })
            else if (!publication) return removeFiles(filePath, res, 'NOT ALLOWED')
            Publication.findByIdAndUpdate(publicationID, { file: fileName }, { new: true }, (err, updated) => {
                if (err) return res.status(500).send({ message: 'ERROR UPDATING USER' })
                else if (!updated) return res.status(404).send({ message: 'not updated' })
                else return res.status(200).send({ user: updated })
            })
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
    let pathFile = './uploads/publications/' + imageFile
    fs.exists(pathFile, exists => {
        if (exists) return res.sendFile(path.resolve(pathFile))
        else return res.send(200).send({ message: 'there is no File' })
    })
}

/**
 * delete a file from the proyect tree
 * @param {location of the file} filePath
 * @param { response } res 
 * @param { text } message 
 */
const removeFiles = (filePath, res, message) => {
    fs.unlink(filePath, (err) => res.status(403).send({ message: message }))
}

module.exports = {
    save,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}
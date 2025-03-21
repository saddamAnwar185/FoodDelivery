const express = require('express')
const router = express.Router()
const {Users} = require('../Models/Models')
const { verifyUserAuth } = require('../middleWares/auth')

router.get('/allUser', verifyUserAuth ,async(req, res) =>{
    try {
        const allUsers = await Users.find({})
    res.json({
        allUsers
    })
    } catch (error) {
        if(error) {
            res.json({
                'messege': 'Internal Server Error'
            })
        }
    }
})

module.exports = router
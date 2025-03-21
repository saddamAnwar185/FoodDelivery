const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const router = express.Router()

router.get('/verifyLogin', verifyUserAuth ,(req, res) => {
    try {
        res.json({
            'sucess': true,
            'messege': 'User is Login'
        })
    } catch (error) {
     res.json({
        'sucess': false,
        'messege': 'Internal Server Error'
     })   
    }
})

module.exports = router
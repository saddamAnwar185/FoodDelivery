const express = require('express')
const router = express.Router()
const {headersImages} = require('../Models/Models')


router.get('/showHeaderImages', async(req, res) => {
    try {
        const images = await headersImages.find({})
    if(images){
        res.json({
            images
        })
    } else {
        res.json({
            'sucess': false,
            'messege': 'Images Not Found'
        })
    }
    } catch (error) {
        res.json({
            'sucess': false,
            'messege': 'Something Went Wrong'
        })
    }
})

module.exports = router
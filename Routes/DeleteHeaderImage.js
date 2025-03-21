const express = require('express')
const router = express.Router()
const {headersImages} = require('../Models/Models')
const { verifyUserAuth } = require('../middleWares/auth')
const Cloudnery = require('../controller/Cloudnery')


router.delete('/deleteHeaderImage/:id', verifyUserAuth ,async(req, res) => {
    const id = req.params.id
    try {
        const deletedImage = await headersImages.findByIdAndDelete(id)
        const result = await Cloudnery.uploader.destroy(deletedImage.image.public_id)
        if(deletedImage&& result){
            res.json({
                'sucess': true,
                'messege': 'Video Deleted'
            })
        } else if(!deletedImage){
            res.json({
                'sucess': false,
                'messege': 'Video not deleted'
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
const express = require('express')
const { Foods } = require('../Models/Models')
const router = express.Router()

router.get('/showfoods' , async(req, res) => {
    const foods = await Foods.find({})
    try {
        res.json({
            foods
        })
    } catch (error) {
        res.json({
            error
        })
    }
})

module.exports = router
const express = require('express')
const { handleAddFood } = require('../controller/Controller')
const { verifyUserAuth } = require('../middleWares/auth')
const router = express.Router()

router.post('/addfood', verifyUserAuth ,handleAddFood)

module.exports = router
const express = require('express')
const { showStoreToggle } = require('../controller/Controller')
const { verifyUserAuth } = require('../middleWares/auth')
const router = express.Router()

router.get('/showStoreToggle', verifyUserAuth ,showStoreToggle)

module.exports = router
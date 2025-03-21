const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleOrderPlace } = require('../controller/Controller')
const router = express.Router()

router.post('/order/:id', verifyUserAuth, handleOrderPlace)

module.exports = router
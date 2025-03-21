const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleCancleOrder } = require('../controller/Controller')
const router = express.Router()

router.post('/cancleOrder/:id', verifyUserAuth, handleCancleOrder)

module.exports = router
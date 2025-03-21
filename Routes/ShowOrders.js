const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleShowOrders } = require('../controller/Controller')
const router = express.Router()

router.get('/showOrders', verifyUserAuth, handleShowOrders)

module.exports = router
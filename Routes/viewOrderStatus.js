const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleViewOrders } = require('../controller/Controller')
const router = express.Router()

router.get('/viewOrders/:id', verifyUserAuth, handleViewOrders)

module.exports = router
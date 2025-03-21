const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleChangeOrderStatus } = require('../controller/Controller')
const router = express.Router()

router.post('/changeStatus/:id', verifyUserAuth, handleChangeOrderStatus)

module.exports = router
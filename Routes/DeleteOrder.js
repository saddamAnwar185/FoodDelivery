const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleDeleteOrder } = require('../controller/Controller')
const router = express.Router()

router.delete('/deleteorder/:id', verifyUserAuth, handleDeleteOrder)

module.exports = router
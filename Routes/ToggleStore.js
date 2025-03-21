const express = require('express')
const { handleToggleStore } = require('../controller/Controller')
const { verifyUserAuth } = require('../middleWares/auth')
const router = express.Router()

router.post('/toggleStore', verifyUserAuth ,handleToggleStore)

module.exports = router
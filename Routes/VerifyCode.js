const express = require('express')
const { handleVerifyCode } = require('../controller/Controller')
const router = express.Router()

router.post('/verifyCode', handleVerifyCode)

module.exports = router
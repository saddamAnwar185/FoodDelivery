const express = require('express')
const { handleForgetPassword } = require('../controller/Controller')
const router = express.Router()

router.post('/forgetPassword', handleForgetPassword)

module.exports = router
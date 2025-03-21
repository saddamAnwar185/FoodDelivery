const express = require('express')
const { handleSetNewPasswod } = require('../controller/Controller')
const router = express.Router()

router.post('/newPassword/:id', handleSetNewPasswod)

module.exports = router
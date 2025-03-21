const express = require('express')
const router = express.Router()
const { handleSingUp } = require('../controller/Controller.js')

// models

router.post("/singup", handleSingUp)

module.exports = router
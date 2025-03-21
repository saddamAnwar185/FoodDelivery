const express = require('express')
const { handleDeleteFood } = require('../controller/Controller')
const { verifyUserAuth } = require('../middleWares/auth')
const router = express.Router()

router.delete('/deletefood/:id', verifyUserAuth ,handleDeleteFood)

module.exports = router
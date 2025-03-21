const express = require('express')
const { handleUserDelete } = require('../controller/Controller')
const { verifyUserAuth } = require('../middleWares/auth')
const router = express.Router()

router.get('/admin/deleteUser/:id', verifyUserAuth , handleUserDelete)

module.exports = router
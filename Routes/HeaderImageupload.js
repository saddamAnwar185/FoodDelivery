const express = require('express')
const { verifyUserAuth } = require('../middleWares/auth')
const { handleUploadHeaderVideo } = require('../controller/Controller')
const router = express.Router()

router.post('/uploadVideo', verifyUserAuth , handleUploadHeaderVideo)

module.exports = router
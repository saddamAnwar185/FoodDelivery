const express = require('express');
const { verifyUserAuth } = require('../middleWares/auth');
const router = express.Router()

router.get('/logout', verifyUserAuth , (req, res) => {
    res.clearCookie("uid");
    res.json({
        'sucess': true,
        'messege': '✅ Logout Sucesfully'
    })
})

module.exports = router
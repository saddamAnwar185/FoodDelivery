require('dotenv').config();
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

const setUser = (loginUser) => {
    const payload = {
        name: loginUser.name,
        email: loginUser.email

    } 
    const token = jwt.sign(payload, secret)
    return token
}

const verifyUserAuth = (req, res, next) => {
const token = req.cookies.uid
if(!token){
    res.json({
        'sucess': false,
        'messege': 'login first'
    })
} else if(token) {
    const verify = jwt.verify(token, secret)
    if(verify){
        next()
    } else if(!verify) {
        res.json({
            'sucess': false,
            'messege': 'You are not authenticated'
        })
    }
}
}

module.exports = {setUser, verifyUserAuth}
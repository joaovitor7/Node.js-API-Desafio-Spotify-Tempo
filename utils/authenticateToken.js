require('dotenv').config()
const jwt = require('jsonwebtoken')

const { ACCESS_TOKEN_SECRET } = process.env

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
       return res.sendStatusS(401)
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, clientId)=>{
        if(err){
            console.log(err)
            return res.sendStatus(403)
        }
        req.clientId = clientId
        next()
    })
}

module.exports = authenticateToken
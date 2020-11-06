require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())

const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SERVER_PORT_AUTH} = process.env
const refreshTokens = []


app.post('/login', (req, res) =>{
    const clientId = req.body.clientId 
    const token = jwt.sign({clientId}, ACCESS_TOKEN_SECRET, {expiresIn: '2m'})
    const refreshToken = jwt.sign({clientId}, REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({
        token,
        refreshToken
    })
})

app.post('/token', (req,res) =>{
    const refreshToken = req.body.token
    if (refreshToken == null){
        return res.sendStatus(403)
    }
    if(!refreshToken.includes(refreshTokens)){
        return res.sendStatus(403)
    }
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, clientId)=>{
        if(err){
            console.log(err)
            return res.sendStatus(403)
        }
        const accessToken = jwt.sign(clientId, ACCESS_TOKEN_SECRET, {expiresIn: '20s'})
        res.json({ accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.listen(SERVER_PORT_AUTH, () => {
    console.log("Auth Server is Up on port" + SERVER_PORT_AUTH)
})


require('dotenv').config()
const express = require('express')
const app = express()
const {weather, weatherLatLong}  = require('../utils/weather')
const spotify = require('../utils/spotify')
const authenticateToken = require('../utils/authenticateToken')

const {SERVER_PORT_RESOURCE} = process.env

app.use(express.json())

app.get('/',authenticateToken, (req,res) => {
    const address = req.query.address
    const lat = req.query.lat
    const lon = req.query.lon
    if (address){
        weather(address, (erro, { clima, descricao, temperature, humidade }) => {
            if (erro){
                res.send({erro})
            }
            spotify(temperature, (erro, {tracksName}) =>{
                if(erro){
                    res.send({erro})
                }
                res.send({tracksName, temperature})
            })
        })
    } else if (lat && lon){
        weatherLatLong(lat,lon, (erro, { clima, descricao, temperature, humidade }) => {
            if (erro){
                res.send({erro})
            }
            spotify(temperature, (erro, {tracksName}) =>{
                if(erro){
                    res.send({erro})
                }
                res.send({tracksName, temperature})
            })
        })
    } else {
        res.send({erro: "Invalid Parametres"})
    }
})


app.listen(SERVER_PORT_RESOURCE, ()=> {
    console.log("App Server is Up on port" + SERVER_PORT_RESOURCE)
})
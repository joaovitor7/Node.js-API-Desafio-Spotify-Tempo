const request = require('request')

const weather = (address, callback) => {
        const API_TOKEN_MAP = "b77e07f479efe92156376a8b07640ced"
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(address) + "&appid=" + API_TOKEN_MAP

        request({url, json:true}, (error, { body }) => {
            if (error){
                callback("Unable to connect with openweathermap API.", undefined)
            } else if (body.message){
                callback("Error! Message: " + body.message, undefined)
            } else {
                callback(undefined, 
                    {   
                        clima : body.weather[0].main,
                        descricao: body.weather[0].description,
                        temperature : (body.main.temp-273.15),
                        humidade : body.main.humidity
                    })
            }
        })
    }

const weatherLatLong = (lat, lon, callback) => {
        const API_TOKEN_MAP = "b77e07f479efe92156376a8b07640ced"
        const url = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat + "&lon=" + lon + "&appid=" + API_TOKEN_MAP

        request({url, json:true}, (error, { body }) => {
            if (error){
                callback("Unable to connect with openweathermap API.", undefined)
            } else if (body.message){
                callback("Error! Message: " + body.message, undefined)
            } else {
                callback(undefined, 
                    {   
                        clima : body.weather[0].main,
                        descricao: body.weather[0].description,
                        temperature : (body.main.temp-273.15),
                        humidade : body.main.humidity
                    })
            }
        })
    }



module.exports = {weather, weatherLatLong}
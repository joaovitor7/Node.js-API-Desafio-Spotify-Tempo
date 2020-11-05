require('dotenv').config()
const request = require('request') 

const spotify = (temperature, callback) => {
    const clientId = process.env.SPOTIFY_CLIENT_TOKEN
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET_TOKEN

    const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + ((Buffer.from(clientId + ':' + clientSecret)).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
    }

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const token = body.access_token
            const playlistId = getPlaylistIdByTemperature(temperature)
            const options = {
            url: 'https://api.spotify.com/v1/playlists/'+ playlistId + '/tracks?market=BR',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
            }
            
            request.get(options, (error, response, body) =>{
                if (!error && response.statusCode === 200) {
                    
                    const tracksName = body.items.map((item) => {
                        return item.track.name
                    })
                    callback(undefined, {tracksName})

                } else {
                    callback("Unable to get tracks for this playlist id.", undefined)
                }
            })
        } else {
            callback("Unable to get access token.", undefined)
        }
})

}

const getPlaylistIdByTemperature = (temperature) => {
    
    const playlistId = {
        classical : '37i9dQZF1DWWEJlAGA9gs0',
        party : '6IfGK9nLC9ChgD7FTZzkLJ',
        pop : '37i9dQZF1DX1ngEVM0lKrb',
        rock: '01zzqHy5rv189lOqeLJgl9'
    } 
    
     if (temperature > 30){
        return playlistId.party
     } else if (temperature >= 15 && temperature < 30) {
        return playlistId.pop
     }  else if (temperature >= 10 && temperature < 14)  {
        return playlistId.rock
     } else {
         return playlistId.classical
     }
}

module.exports = spotify

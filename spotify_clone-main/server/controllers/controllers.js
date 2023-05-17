const SpotifyWebApi = require('spotify-web-api-node')
const lyricsFinder = require('lyrics-finder')

exports.login_complete = (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.URI,
        clientId: process.env.ID,
        clientSecret: process.env.SECRET
    })
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((err) => {
        res.sendStatus(400)
    })
}

exports.refresh_complete = (req, res) => {
    const refreshToken = req.body.refreshToken
    console.log('hhhh')
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.URI,
        clientId: process.env.ID,
        clientSecret: process.env.SECRET,
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        function(data) {
          res.json({
              accessToken: data.body.access_token,
              expiresIn: data.body.expires_in
          })
          spotifyApi.setAccessToken(data.body['access_token']);
        }).catch((err) => {
            res.sendStatus(400)
        });
}

exports.lyrics = async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
    res.json({ lyrics })
}

  var SpotifyWebApi = require('spotify-web-api-node');
  const express = require('express');
  const cors = require('cors');
  const request = require('request');

  
  const scopes = [
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'app-remote-control',
      'user-read-email',
      'user-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-read-private',
      'playlist-modify-private',
      'user-library-modify',
      'user-library-read',
      'user-top-read',
      'user-read-playback-position',
      'user-read-recently-played',
      'user-follow-read',
      'user-follow-modify'
    ];
    
  // credentials are optional
  var spotifyApi = new SpotifyWebApi({
      clientId: '173c21938ff54c0c9f34efc43ec6fde7',
      clientSecret: '3578aed450914f87877531c46f456108',
      redirectUri: 'http://localhost:8888/callback'
    });
    
    const app = express();

    app.use(cors());
    
    app.get('/login', (req, res) => {
      res.redirect(spotifyApi.createAuthorizeURL(scopes));
    });
    
    app.get('/callback', (req, res) => {
      const error = req.query.error;
      const code = req.query.code;
      const state = req.query.state;
    
      if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
      }
    
      spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
          const access_token = data.body['access_token'];
          const refresh_token = data.body['refresh_token'];
          const expires_in = data.body['expires_in'];

          // console.log(data);
          spotifyApi.setAccessToken(access_token);
          spotifyApi.setRefreshToken(refresh_token);
    
          console.log('access_token:', access_token);
          console.log('refresh_token:', refresh_token);
    
          console.log(
            `Sucessfully retreived access token. Expires in ${expires_in} s.`
          );
          res.send('Success! You can now close the window.');
    
          // setInterval(async () => {
          //   await spotifyApi.refreshAccessToken(refresh_token);
          //   // console.log(data);
          //   const access_token = data.body['access_token'];
    
          //   console.log('The access token has been refreshed!');
          //   console.log('access_token:', access_token);
          //   spotifyApi.setAccessToken(access_token);
          // }, expires_in / 2 * 1000);

        })
        .catch(error => {
          console.error('Error getting Tokens:', error);
          res.send(`Error getting Tokens: ${error}`);
        });
    });

    
    app.get('/refresh_token', function(req, res) {

      var refresh_token = req.query.refresh_token;
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (Buffer.from('173c21938ff54c0c9f34efc43ec6fde7' + ':' + '3578aed450914f87877531c46f456108').toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: 'AQCeMu4DYW3HYDo7wsoS3VZ19ouPBPP5PA73vYRLWEIHP8U_fXrPyJp20cTiH7kiqM08ELXqKfDhqUfDym4cdyLXXqRb17OK3JP10ASYYIGlJbV07XgrtlX1mQ5hooZd0V0'
        },
        json: true
      };
    
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token;
          res.send({
            'access_token': access_token
          });
        }
      });
    });

    app.listen(8888, () =>
      console.log(
        'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
      )
    );
  
  
  
  
  
  






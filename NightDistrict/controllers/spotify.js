import SpotifyWebApi from 'spotify-web-api-node';
import request from 'request';
import dotenv from 'dotenv';
import users from "../models/users.js";

dotenv.config();

const scopes = [
    'playlist-read-collaborative',
    'playlist-read-private',
    'user-library-read',
  ];
  
// credentials are optional
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});
  
const login = (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
}
  
const callback = (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      res.status(400).json(error);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        
        res.status(200).json({ access_token: access_token, refresh_token: refresh_token, expires_in: expires_in});
        
      })
      .catch(error => {
        res.status(401).json(error);
      });
  }

const set = async (req, res) => {
  try{
    if(req.headers.access_token && req.headers.refresh_token){
      if(req.body.id){
        const update = await users.findByIdAndUpdate(req.body.id, { $set: { access_token: req.headers.access_token, refresh_token: req.headers.refresh_token }});
        if(update){
          res.status(200).json("Successful")
        }
        else{
          res.status(401).json("error updating db");
        }
      }
      else{
        res.status(401).json("no id provided");
      }
    }
    else{
      res.status(401).json("token not provided in header");
    }
  }
  catch(err){
    res.status(500).json(err);
  }
}

//hit this url before extracting user's spotify info. access token expires every 60 mins.
const refresh_token = async (req, res) => {

    const user = await users.findById(req.body.id)
    const refresh_token = user.refresh_token

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, async function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        await user.update({ access_token: access_token });
        res.status(200).json({ access_token: access_token });
      }
      else{
        res.json(error);
      }
    });
  }

export default {
  login,
  callback,
  set,
  refresh_token
}
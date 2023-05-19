const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQCL_BdObRm0xGXYtk1JcfPEWvEQBjNrdycpPzQbmOWdwRIabIQA5nIIrFR3QITsel51vEtotZH81NsGzZabHy0OA-mMvY13r5m8YsOIxsExTfox3Q3hSeM0l-N8KuaMREjMSYc1w3wTXmtd0LRHGNXL0R8qj63f_40J9BHVwnjR5-VvqBtVTTcofjmvWZup3luvkuasz8_SYdlhaJVyR6gTX5d08trnfe8oS3HAxTYgzAPn2Zuvsw5i2gGf9V0AK6vnceortUMmuoyiXTn-3Iuq-mSZjDsxiWptwNXFZe1Ce2baGQd0eufWOIq27LllkWdP7pBWTZi_-sW1tpjV9Q";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
async function getMyData() {
//   (async () => {
//     const me = await spotifyApi.getMe();
//     // console.log(me.body);

//     //calling function getUserPlaylists
//     // getUserPlaylists(me.body.id);
//   })().catch(e => {
//     console.error(e);
//   });
    // const token = req.headers.token;
    // const spotifyApi = new SpotifyWebApi();
    // spotifyApi.setAccessToken(token);
    try{
        const me = await spotifyApi.getMe();
        if(me){
            try{
                const data = await spotifyApi.getUserPlaylists(me.body.id);
                if(data){
                    for (let playlist of data.body.items) {
                        console.log(playlist.id + " " + playlist.name)
                        const tracks = await spotifyApi.getPlaylistTracks(playlist.id, {
                            offset: 0,
                            limit: 100,
                            fields: 'items'
                        });
                        if(tracks){
                            console.log(tracks.body.items[1].track.name);
                        }
                        else{
                            console.log("no tracks exist");
                        }
                    }
                }
                else{
                    console.log("no playlist exist");
                }
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            console.log("error getting user info");
        }
    }
    catch(err){
        console.log(err)
    }
}

getMyData();
const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQBec-0P7VrYeoSATGfIrGuPlNgT0CCxJWMdsFn99WpawoGueKIuXBmtOYm7_AX-MeLB-_mPaKIMD5ZnawCMcCu2cUIuw9TL45WgTQeGHBlu1PdnbFLUKCUFGFULFckRK9Rf-2ZTniKuIAOlO7xpsACISetYWckh9NLTPCLNdcSLDMxBe_T2h7S8-kEhJ-L1GMUs5qQxq1gVuvq1dShYzs2dvgV-1NarNXr1Y8itYVFSAJnUaeXGX4hwAetdvztiaPgPG0sF81gIdY7Pq8YF1hbbeJ6GUY22ZQZ-mPZ7YWfihiYH-voFwyh_F59wVh95HecW8thr9X8mErle-7tfKw";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);

    //calling function getUserPlaylists
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS function defining
async function getUserPlaylists(userName) {

   //spotify built in method getUserPlaylists
  const data = await spotifyApi.getUserPlaylists(userName)
  // console.log(data);

  console.log("---------------+++++++++++++++++++++++++")


  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    //calling function getPlaylistTracks
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST defining function 
async function getPlaylistTracks(playlistId, playlistName) {

  //spotify built in method
  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 0,
    limit: 100,
    fields: 'items'
  })

  // console.log(data);

  // console.log(data.body.items);
  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    // console.log(tracks);
    console.log(track.name + " : " + track.artists[0].name);
  }
  // console.log(tracks);
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();

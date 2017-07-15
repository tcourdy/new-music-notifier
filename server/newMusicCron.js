const request = require('request');
const serverUtils= require('./serverUtils');

//SPOTIFY credentials
const SPOTIFY_BASE = 'https://api.spotify.com';
const CLIENT_ID = '55d3c96112e045538e40e5e791276c2c';
const CLIENT_SECRET = '87300c8aef8a4477b2710f638823a4fb';

var accessToken;
var accessTokenExpiration;

//MYSQL connection credentials
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'spotify',
  password: 'gPkgDJA8OpBcm7RnoP2T',
  database: 'spotify_db'
});

getAccessToken();
getNewMusicReleases();

// get access token to make api requests
function getAccessToken() {
  var base64 = new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

  request({
    uri: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    json: true,
    form: {grant_type: 'client_credentials'}, // form adds appropriate content type header
    headers: {'Authorization':  'Basic ' + base64}
  }, function(error, response, body) {
    if(response.statusCode != 200) {
      console.log("Something went wrong when getting spotify api token");
    } else {
      console.log(body.access_token);
      accessToken = body.access_token;
      accessTokenExpiration = new Date(Date.now() + (body.expires_in * 1000));
    }
  });
}

function getNewMusicReleases(offset) {
  request({
    uri: SPOTIFY_BASE + "/v1/browse/new-releases?country=US&offset=" + offset;
    method: 'GET',
    json: true,
    headers: {'Authorization' : 'Bearer ' + accessToken}
  }, function(error, response, body) {
    if(response.statusCode != 200) {
      console.log("Something went wrong");
      console.log(body);
    } else {
      processNewMusic(body.albums.items);
    }
  });
}

// for each new album that has been released send a sms notification to users
// that are interested in the artist who made the album
function processNewMusic(newAlbums) {
  var artistIdMap = new Map();
  newAlbums.forEach(function(newRelease) {
    var artistIDs = newRelease.artists.forEach(function(artist) {
        artistIdMap.set(artist.id, artist.name);
    });

    var spotifyURL = newRelease.external_urls.spotify;
    for(artistID of artistIdMap.keys) {
      var userIDs = getUsersFollowingArtist(artistID, function(users) {
        return users;
      });
      sendNotificationToUsers(userIds, spotifyURL, artistIdMap.get(artistID));
    }
  });
}

function sendNotificationToUsers(userIds, spotifyURL, artistName) {
  connection.connect();
  var sql = "select phoneNumber from users where userID in ( " +
            connection.escape(userIds) + ")";

  connection.query(sql, function(error, results, fields) {
    results.forEach(function(val) {
      serverUtils.sendNewMusicNotification(val.phoneNumber, spotifyURL, artistName);
    });
  });
}

// returns an array of userIDs that are interested in the provided artistIDs
function getUsersFollowingArtist(artistID, callback) {
  connection.connect();
  var sql = "Select userID from followedArtists where spotifyArtistID in ( "
          + connection.escape(artistID) + ')';

  var userArray = [];
  connection.query(sql, function(error, results, fields) {
    results.forEach(function(val) {
      userArray.push(val.userID);
    });
    callback(userArray);
  });
  connection.end();
} 

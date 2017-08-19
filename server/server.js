const express = require('express');
const app = express();
const port = 3001;
const request = require('request');
const bodyParser = require('body-parser');
const serverUtils = require('./serverUtils');
const bcrypt = require('bcrypt');
const bcryptSaltRounds = 10;
const sessions = require('client-sessions');
const fs = require('fs');

// read credentials from creds.json
var creds = JSON.parse(fs.readFileSync('./creds.json', 'utf8'));

const SPOTIFY_BASE = 'https://api.spotify.com';
const CLIENT_ID = creds.spotify_client_id;
const CLIENT_SECRET = creds.spotify_client_secret;

var accessToken;
var accessTokenExpiration;


// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessions({
  cookieName: 'session',
  secret: serverUtils.createSecret(),
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5
  //  httpOnly: true
}));
app.use(checkAccessTokenExpiration);
app.use(['/searchArtists', '/mostFollowed', '/userArtistList', '/followArtist', '/unfollowArtists'],
        checkForSession);

//REST ENDPOINTS
app.get('/searchArtists', function(req, res) {
  var artist = req.query.artist;
  
  request({
    uri: SPOTIFY_BASE + "/v1/search?type=artist&q=" + artist,
    method: 'GET',
    json: true,
    headers: {'Authorization' : 'Bearer ' + accessToken}
  }, function(error, response, body) {
    if(response.statusCode != 200) {
      res.status(response.statusCode);
      res.json(error);
    } else {
      var result = serverUtils.processSearch(body.artists.items);
      res.json(result);
    }
  });
});

app.post('/logout', function(req, res) {
  req.session.destroy();
  res.json({result: 'Success'});
});

app.get('/mostFollowed', function(req, res) {
  serverUtils.mostFollowedArtists(function(items) {
    res.json(items);
  });
});

app.get('/userArtistList', function(req, res) {
  serverUtils.getUserArtistList(req.session.userID, function(items) {
    res.json(items);
  });
});

//TODO: use authorization header for credentials
app.post('/login', function(req, res) {
  var userPhone = req.body.userPhone;
  var password = req.body.password;

  serverUtils.lookUpUser(userPhone, password, function(userID) {
    if(userID !== -1) {
      req.session.userID = userID;
      res.json({result: 'Success'});
    } else {
      res.status(401);
      res.json({result: 'Invalid username or password'});
    }
  });
});

app.post('/sendTwilioPin', function(req, res) {
  var userPhone = req.body.phoneNumber;
  var pin = serverUtils.generatePIN();

  serverUtils.storeNumberAndPin(userPhone, pin, function() {
    serverUtils.sendTwilioPin(userPhone, pin);
    res.json({result: 'Success'});
  });
});

app.post('/verifyTwilioPin', function(req, res) {
  var phoneNumber = req.body.phoneNumber;
  var pin = parseInt(req.body.pin);
  serverUtils.verifyTwilioPin(phoneNumber, pin, function(isValid) {
    if(isValid) {
      res.json({result: 'Success'});
    } else {
      res.json({result: 'Error', message: 'Unable to verify TwilioPin'});
    }
  });
});

app.post('/createNewUser', function(req, res) {
  var phoneNumber = req.body.phoneNumber;
  var password = req.body.password;

  bcrypt.hash(password, bcryptSaltRounds, function(err, hash) {
    if(err) {
      res.json({result: 'Error', message: 'Unable to create new user'});
      console.log(err);
    } else {
      serverUtils.registerNewUser(phoneNumber, hash, function(userID) {
        //res.cookie('userID', userID);
        req.session.userID = userID;
        res.json({result: 'Success'});
      });
    }
  });
});

app.post('/followArtist', function(req, res) {
  var spotifyArtistID = req.body.spotifyArtistID;
  var spotifyArtistName = req.body.spotifyArtistName;
  var userID = req.session.userID;
  serverUtils.followArtist(spotifyArtistID, spotifyArtistName,
                           userID, function(data) {
                             if(true) {
                               res.json({result: 'Success'});
                             } else {
                               res.json({result: 'Error', message: 'Error following artist'});
                             }
                           });
});

app.post('/unfollowArtists', function(req, res) {
  var spotifyArtistIDs = req.body.artistIds;
  var userID = req.session.userID;
  serverUtils.unfollowArtists(spotifyArtistIDs, userID, function(result) {
    if(result) {
      res.json({result: 'Success'});
    } else {
      res.json({result: 'Error', message: 'Error Unfollowing Artist'});
    }
  });
});

getAccessToken();

app.listen(port, function() {
  console.log("Server listening on port " + port); 
});

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
      accessToken = body.access_token;
      accessTokenExpiration = new Date(Date.now() + (body.expires_in * 1000));
    }
  });
}


// Middleware function to check if the access token to spotify has expired
function checkAccessTokenExpiration(req, res, next) {
  if(Date.now() >= accessTokenExpiration) {
    getAccessToken();
  }
  next();
}

function checkForSession(req, res, next) {
  if(!req.session.userID) {
    res.status(401);
    res.json({error: "Unauthorized"});
  } else {
    next();
  }
}

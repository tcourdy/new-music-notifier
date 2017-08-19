const mysql = require('mysql');
const twilio = require('twilio');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');

// read credentials from creds.json
var creds = JSON.parse(fs.readFileSync('./creds.json', 'utf8'));

const twilioAccountSid = creds.twilio_account_sid;
const twilioAuthToken = creds.twilio_auth_token;
const twilioNumber = creds.twilio_number;
var twilioClient = twilio(twilioAccountSid, twilioAuthToken);

//MYSQL connection credentials
//TODO: consider using a connection pool
const connection = mysql.createConnection({
    host: 'localhost',
    user: creds.mysql_user,
    password: creds.mysql_pass,
    database: 'spotify_db'
});

connection.connect();

// export these so we can require them in other files
module.exports = {
  // parse the json of searching for an artist to send minimal amount of data to client
  processSearch: function (artistArray) {
    return artistArray.map(function(val, index, array) {
      return {id: val.id, name: val.name};
    });
  },

  createSecret: function() {
    var secret = this.generatePIN().toString(10);
    var val = this.generatePIN().toString(10);
    var hash = crypto.createHmac('sha256', secret)
          .update(val)
          .digest('hex');
    return hash;
  },

  // generate pin for user to verify phone number
  generatePIN: function () {
    return Math.floor(Math.random() * (9999 - 1000)) + 1000;
  },

  // verify twilio pin number by making sure it is stored in our db
  verifyTwilioPin: function (phone, pin, callback) {
    var sql = 'SELECT * from phone_verification where phoneNumber = ' +
          connection.escape(phone) + ' and pin=' + connection.escape(pin);

    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(error);
      } else if(results.length == 1) {
        removeVerificationDBEntry(phone, pin, function(val) {
          if(val) {
            callback(true);            
          } else {
            callback(false);
          }
        });
      } else {
        callback(false);
      }
    });
  },

  followArtist: function(spotifyArtistID, artistName, userID, callback) {
    var sql = 'SELECT * from spotify_artists sa where ' +
          'sa.spotifyArtistID = ' + connection.escape(spotifyArtistID);
    var self = this;

    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
      } else if(results.length === 0) {
        self.insertArtist(spotifyArtistID, artistName, userID, callback);
      } else if (results.length === 1) {
        self.updateFollowedArtists(spotifyArtistID, userID, callback);
      }
    });
  },

  insertArtist: function(spotifyArtistID, artistName, userID, callback) {
    var sql = "INSERT into spotify_artists VALUES(" +
          connection.escape(spotifyArtistID) + "," +
          connection.escape(artistName) + ")";
    var self = this;

    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
      } else {
        self.updateFollowedArtists(spotifyArtistID, userID, callback);
      }
    });
  },

  updateFollowedArtists: function(spotifyArtistID, userID, callback) {
    var sql = "INSERT INTO followed_artists (userID, spotifyArtistID) VALUES(" +
          connection.escape(userID) + "," +
          connection.escape(spotifyArtistID) + ")";

    
    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
      } else {
        callback(true);
      }
    });
  },

  unfollowArtists: function(spotifyArtistIDs, userID, callback) {
    var sql = "DELETE FROM followed_artists where " +
          " spotifyArtistID in (" + connection.escape(spotifyArtistIDs) +
          ") AND userID = " + connection.escape(userID);

    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
      } else {
        callback(true);
      }
    });
  },

  mostFollowedArtists: function(callback) {
    var sql = 'SELECT sa.artistName, count(sa.artistName) as count from spotify_artists sa '  +
          'JOIN followed_artists fa on fa.spotifyArtistID = sa.spotifyArtistID ' +
          'GROUP BY artistName ORDER BY count(sa.artistName) LIMIT 10';

    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
      } else {
        var resultsArray = results.map(item => {
          return {artistName: item.artistName, followCount: item.count};
        });
        callback(resultsArray);
      }
    });
  },

  getUserArtistList: function(userID, callback) {
    var sql = 'SELECT sa.artistName,  sa.spotifyArtistID from spotify_artists sa ' +
          'JOIN followed_artists fa on fa.spotifyArtistID = sa.spotifyArtistID ' +
          'WHERE fa.userID = ' + connection.escape(userID);

    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(error);
      } else {
        var resultsArray = results.map(item => {
          return {artistName: item.artistName, artistID: item.spotifyArtistID};
        });
        callback(resultsArray);
      }
    });
  },


  // store the users phone number and associated pin for verification later
  storeNumberAndPin: function (phone, pin, callback) {
    var sql = 'INSERT INTO phone_verification VALUES(' +
          connection.escape(phone) + ',' + connection.escape(pin) + ')';
    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(error);
      } else {
        callback();
      }
    });
  },

  sendTwilioPin: function(phone, pin) {
    twilioClient.messages.create({
      to: phone,
      from: twilioNumber,
      body: "Your PIN is " + pin
    }, function(err, message) {
      if(err) {
        console.error(err.message);
      }
    });
  },

  sendNewMusicNotification: function(phone, spotifyUrl, artistName) {
    twilioClient.sendMessage({
      to: phone,
      from: twilioNumber,
      body: "New music from " + artistName + ": " + spotifyUrl
    });
  },

  lookUpUser: function(phone, password, callback) {
    var sql = 'select userID, password from user where phoneNumber=' + connection.escape(phone);
    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
        callback(-1);
      }
      if(results.length == 1) {
        bcrypt.compare(password, results[0].password, function(err, res) {
          if(res) {
            callback(results[0].userID);
          } else {
            callback(-1);
          }
        });
      } else {
        callback(-1);
      }
    });
  },

  registerNewUser: function(phone, hash, callback) {
    var sql = 'INSERT INTO user (phoneNumber, password) values(' +
          connection.escape(phone) + ', ' + connection.escape(hash) +')';
    connection.query(sql, function(error, results, fields) {
      if(error) {
        console.log(error);
      } else {
        callback(results.insertId);
      }
    });
  }
};  // end module.exports

function removeVerificationDBEntry(phone, pin, callback) {
  var sql = 'delete from phone_verification where phoneNumber=' +
        connection.escape(phone) + 'and pin=' + connection.escape(pin);
  connection.query(sql, function(error, results, fields) {
    if(error) {
      console.log(error);
      callback(false);
    } else {
      callback(true);
    }
  });
}


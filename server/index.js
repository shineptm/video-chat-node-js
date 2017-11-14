'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */



require('dotenv').load();

var connection = require('./config'); // For Room Authentication to MySQL DB



var bodyParser = require('body-parser');

var http = require('http');
var path = require('path');
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var express = require('express');
var randomName = require('./randomname');



// Create Express webapp.
var app = express();
var roomNm = '';

/*
// Set up the paths for the examples.
[
  'bandwidthconstraints',
  'codecpreferences',
  'localvideofilter',
  'localvideosnapshot',
  'mediadevices'
].forEach(function(example) {
  var examplePath = path.join(__dirname, `../examples/${example}/public`);
  app.use(`/${example}`, express.static(examplePath));
});
*/

// Set up the path for the quickstart.
var quickstartPath = path.join(__dirname, '../quickstart/public');
app.use('/quickstart', express.static(quickstartPath));

/*
// Set up the path for the examples page.
var examplesPath = path.join(__dirname, '../examples');
app.use('/examples', express.static(examplesPath));
*/

/**
 * Default to the Quick Start application.
 */
app.get('/', function(request, response) {
  response.redirect('/quickstart');
});

/*
app.use(bodyParser.urlencoded({ extended: true })); 


app.post('/quickstart/index', function(req, res) {
  roomNm =  req.body.room_name ;
  console.log('Posted is : ' + roomNm);
});
*/


app.get('/authenticate', function(req, res) {

  connection.query('SELECT room_name FROM chat_room', function (error, results, fields) {
          if (error) {
                res.send({
                status:false,
                message:'Error with query'
                })
               
          }else{
            if(results.length > 0){
                res.send({
                status:true,
                message:results
               });
            }else{
                res.send({
                status:false,    
                message:"Room Name does not exists"
              });
            }
          }
        });
    
   
});


/**
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */

app.get('/token', function(request, response) {
  var identity = randomName();
  
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});




// Create http server and run it.

var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});


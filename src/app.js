/*
 A Pebble app that uses Google Places API to find the nearest coffee shop or cafe, and gives you the directions
*/

// Import the UI elements
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Finding the nearest coffee shop...',
  font: 'gothic-28-bold',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

var lat;  
var long;

function locationSuccess(pos) {
  lat = pos.coords.latitude;
  long = pos.coords.longitude;
  
// Make request to google places api
ajax(
  {
    url:
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+long+'&radius=200&types=cafe&key=AIzaSyBG4BT7DKSpwLBq3G4o3cIOAxCri4bQXz8',
    type:'json'
  },
  
  function(data) {
    console.log('Successfully fetched the cafe data!');
    
    var location = data.results[0].name;
    var address = data.results[0].vicinity;
    
    // Create a Card with title and subtitle
    var card = new UI.Card({
      title:'Coffee Shop:',
      subtitle:location,
      body: 'Click for address'
    });
    // Show to user
    splashWindow.hide();
    card.show();
    
    card.on('click', function(e) {
      card.title('Address');
      card.subtitle(address);
      card.body('');
    });
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
  
//   console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

// Make an asynchronous request
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
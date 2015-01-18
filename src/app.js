/*
 A Pebble app that uses Google Places API to find the nearest coffee shop or cafe, and gives you the directions

*/

// Import the UI elements
var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
// // Create a simple Card
// var card = new UI.Card({
//   title: 'Coffee Time',
//   body: 'This is your first Pebble app!'
// });

// // Display to the user
// card.show();

var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Finding the nearest coffee shop...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

// Make request to openweathermap.org
ajax(
  {
    url:
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=200&types=cafe&key=AIzaSyBG4BT7DKSpwLBq3G4o3cIOAxCri4bQXz8',
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
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
var destLat;
var destLong;

function locationSuccess(pos) {
  lat = pos.coords.latitude;
  long = pos.coords.longitude;

ajax(
  {
  url: 'http://api.workfrom.co/places/ll/'+lat+','+long+'/',
  type:'json'
  },
  
  function(data) {
    console.log('workfrom works!');
    console.log("Description: " + data.response[0].description);
    console.log("Password: " + data.response[0].password);
  }
  
  
);
  
  
// Make request to google places api
ajax(
  {
    url:
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+long+'&radius=100&types=cafe&key=AIzaSyBG4BT7DKSpwLBq3G4o3cIOAxCri4bQXz8',
    type:'json'
  },
  
  function(data) {
    console.log('Successfully fetched the cafe data!');
    var location = data.results[0].name;
    var address = data.results[0].vicinity;
    destLat = data.results[0].geometry.location.lat;
    destLong = data.results[0].geometry.location.lng;
    
    // Create a Card with title and subtitle
    var card = new UI.Card({
      title:'Coffee Shop:',
      subtitle:location,
      body: 'Click for address'
    });
    // Show to user
    splashWindow.hide();
    card.show();
    
    var addressCard = new UI.Card({
      title: 'Address',
      body: address + '\n Click for turn by turn navigation'
    });
    
    card.on('click', function(e) {
      addressCard.show();
    });
    
    
//   addressCard.on('click', function(e){
    
//   // Make the request using google directions api
//   ajax(
//     {
//       url: 'https://maps.googleapis.com/maps/api/directions/json?origin='+lat+','+long+'&destination='+destLat+ ',' + destLong +  '&mode=walking&key=AIzaSyBG4BT7DKSpwLBq3G4o3cIOAxCri4bQXz8',
//       type: 'json'
//     },
//     function(data) {
//       // Success!
//       console.log('Successfully fetched cafe data!');
//       var i = 0;
//       var dirCard;
//       var getInstructions = function(i){
//         var str = data.routes[0].legs[0].steps[i].html_instructions;
        
//         // Step 3 Turn <b>left</b><div style="font-size:0.9em">Destination will be on the right</div>
//         console.log("Step " + (i + 1) + " " + str);
//         str=str.replace(/<br>/gi, "\n");
//         str=str.replace(/<p.*>/gi, "\n");
//         str=str.replace(/<(?:.|\s)*?>/g, " ");
//         str=str + '\n' + 'for ' + data.routes[0].legs[0].steps[i].distance.text + ' this will take you ' + data.routes[0].legs[0].steps[i].duration.text;
//         return str;
//       };
      
//       var createNewCard = function(i){
//         dirCard = new UI.Card({
//               title:'Step ' + (i+1),
//               body: getInstructions(i)
//             });
//               dirCard.show();
//          dirCard.on('click', function(e) {
//             i++;  
//             createNewCard(i);
//           });
//       };
//       if (i < data.routes[0].legs[0].steps.length) {
//         createNewCard(i);
//       }


//     },
//     function(error) {
//       // Failure!
//       console.log('Failed fetching cafe data: ' + error);
//     });
//   });

  },
  function(error) {
    console.log('Download failed: ' + error);
  }
  
  
);

  
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

// Make an asynchronous request
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);


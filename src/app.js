var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'What day?',
  subtitle:'Fetching...'
});

// Display the Card
card.show();

// Construct URL
var URL = 'https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9dul7c0nu4poqkgbhsfu0qe2t0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw';
var start = moment().startOf('day').format();
var end = moment().endOf('day').format();
var day = 0;

// Make the request
request();
function request() {
  ajax(
    {
      datatype: JSON,
      url: URL + "&timeMin=" + start + "&timeMax=" + end,
      type: 'get'
    },
    function(data) {
      // Success!
      console.log("Successfully fetched day!");
      
      // Extract data
      var Day = FindDay(data);
  
      // Interpret data; try next day if not school day
      if (Day == 'no school') {
        day ++;
        start = moment().startOf('day').add(day, 'days').format();
        end = moment().endOf('day').add(day, 'days').format();
        request();
      } 
      //Show to user if school day
      else {
        switch(day) {
          case 0:
            card.subtitle('Today is' + Day);
            console.log(Day);
            break;
          default:
            card.subtitle(moment().add(day, 'days').format("dddd") + ' will be a ' + Day + '.');
            }      
      }
      card.body('Period 1: French.');
    },
    function(error) {
      // Failure!
      console.log('Failed fetching weather data: ' + error);
    }
  );
}

//Gets the Day from JSON
function FindDay(data) {
  if (data.search('Day') > 0) {
      return data.substring(data.search('Day'), data.search('Day')+ 5);
    }
  return 'no school' ;
  }
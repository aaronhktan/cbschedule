var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'CB Schedule',
  scrollable: true,
  subtitle:'Fetching...',
});

// Display the Card
card.show();

// Construct periods
var onea = localStorage.getItem('onea');
var oneb = localStorage.getItem('oneb');
var onec = localStorage.getItem('onec');
var oned = localStorage.getItem('oned');
var twoa = localStorage.getItem('twoa');
var twob = localStorage.getItem('twob');
var twoc = localStorage.getItem('twoc');
var twod = localStorage.getItem('twod');
var skipped = false;
var Day = 'day';
var dateFetched = 'date';

// Construct URL
var URL = 'https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9dul7c0nu4poqkgbhsfu0qe2t0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw';
var daySkipped = 0;
var start = moment().startOf('day').format();
var end = moment().endOf('day').format();

// Make the request
request();
function request() {
  ajax(
    {
      url: URL + "&timeMin=" + start + "&timeMax=" + end,
    },
    function(data) {
      // Success!
      
      // Extract data and save
      Day = FindDay(data);
  
      // Interpret data; try next day if not school day
      if (Day == 'no school') {
        daySkipped ++;
        start = moment().startOf('day').add(daySkipped, 'days').format();
        end = moment().endOf('day').add(daySkipped, 'days').format();
        request();
      } 
      //Show to user if school day
      else {
        localStorage.setItem('Day', Day);
        localStorage.setItem('dateFetched', moment().add(daySkipped, 'days').format('YYYY-MM-DD'));
        console.log(moment().add(daySkipped, 'days').format('YYYY-MM-DD'));
        display(daySkipped);
        setPeriod(parseInt(Day.substring(4,5)));
      }
    },
    function(error) {
      // Failure!
      console.log('Failed fetching schedule data: ' + error);
      Day = localStorage.getItem('Day');
      dateFetched = localStorage.getItem('dateFetched');
      var timeShown = moment(dateFetched).format('ddd Do MMMM');
      if (moment().isAfter(dateFetched, 'day')) {
        card.subtitle(timeShown + ' was a ' + Day + '.');
        card.body('You\'re offline!  :( Try again later.');
      }
      else {
        card.subtitle(timeShown + ' is a ' + Day + '.');
        setPeriod(parseInt(Day.substring(4,5)));
      }
    }
  );
}

//Gets the Day from JSON
function FindDay(data) {
  if (moment().isAfter(moment().hours(15).minutes(15)) && skipped === false) {
    skipped = true;
    return 'no school';
    }
  else if (data.search('Day') > 0) {
    return data.substring(data.search('Day'), data.search('Day')+ 5);
    }
  return 'no school';
  }

//Displays things to user
function display(day) {
  switch(day) {
    case 0:
      card.subtitle('It\'s a ' + Day + '.');
      break;
    case 1:
      card.subtitle('Tomorrow will be a ' + Day + '.');
      break;
    default:
      card.subtitle(moment().add(day, 'days').format("dddd") + ' the ' + moment().add(day, 'days').format("Do") + ' will be a ' + Day + '.');
  }
}

//App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = "";
  if (onea === null) {
    configURL = 'http://cbschedulemana.ga/index.html';
  }
  else {
    configURL = 'http://cbschedulemana.ga/index.html?' + 'onea=' + encodeURIComponent(onea) + '&oneb=' + encodeURIComponent(oneb) + '&onec=' + encodeURIComponent(onec)+ '&oned=' + encodeURIComponent(oned) + '&twoa=' + encodeURIComponent(twoa) + '&twob=' + encodeURIComponent(twob) + '&twoc=' + encodeURIComponent(twoc) + '&twod=' + encodeURIComponent(twod);
  }
  Pebble.openURL(configURL);
  console.log(configURL);
});

// Decode the user's preferences
Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log(configData.onea);
  onea = configData.onea;
  oneb = configData.oneb;
  onec = configData.onec;
  oned = configData.oned;
  twoa = configData.twoa;
  twob = configData.twob;
  twoc = configData.twoc;
  twod = configData.twod;
  localStorage.setItem('onea', onea);
  localStorage.setItem('oneb', oneb);
  localStorage.setItem('onec', onec);
  localStorage.setItem('oned', oned);
  localStorage.setItem('twoa', twoa);
  localStorage.setItem('twob', twob);
  localStorage.setItem('twoc', twoc);
  localStorage.setItem('twod', twod);
  request();
});

//Displays periods by setting according to day
function setPeriod(day) {
  switch (day){
    case 1:
      var Periods = [
        onea,
        oneb,
        onec,
        oned
      ];
      break;
    case 3:
      Periods = [
        oneb,
        onea,
        oned,
        onec
      ];
      break;
    case 2:
      Periods = [
        twoa,
        twob,
        twoc,
        twod
      ];
      break;
    case 4:
      Periods = [
        twob,
        twoa,
        twod,
        twoc
      ];
      break;
  }
  if (onea === null) {
    card.body('Set your periods here with the Pebble app!');
  }
  else {
  if (moment().isBefore(moment().set({'hour': 09, 'minute':15}))) {
            card.body('First period: ' + Periods[0] + '.');
          }
          else if (moment().isBefore(moment().set({'hour': 10, 'minute':35}))) {
            card.body('Second period: ' + Periods[1] + '.');
          }
          else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
            card.body('Third period: ' + Periods[2] + '.');
          }
          else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
            card.body('Fourth period: ' + Periods[3] + '.');
          }
          else if (moment().isAfter(moment().set({'hour': 21, 'minute':0}))) {
                card.body('Tomorrow\'s first period: ' + Periods[0] + '.');
          }
          else {
            card.body('Have a great rest of the day!');
          }
  }
}
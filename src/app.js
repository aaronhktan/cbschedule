var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'CB Schedule',
  scrollable: true,
  subtitle:'Fetching...'
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
var cycleDay = 0;

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
        display(daySkipped);
      }
    },
    function(error) {
      // Failure!
      console.log('Failed fetching schedule data: ' + error);
      Day = localStorage.getItem('Day');
      dateFetched = localStorage.getItem('dateFetched');
      if (moment().isAfter(dateFetched, 'day')) {
        var timeShown = moment(dateFetched).format('ddd Do MMMM');
        card.subtitle(timeShown + ' was a ' + Day + '.');
      }
      else {
        card.subtitle('It is a ' + Day + '.');
      }
      card.body('You\'re offline!  :( Try again later.');
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
      console.log(Day);
      break;
    case 1:
      card.subtitle('Tomorrow will be a ' + Day + '.');
      break;
    default:
      card.subtitle(moment().add(day, 'days').format("dddd") + ' the ' + moment().add(day, 'days').format("do") + ' will be a ' + Day + '.');
  }
  if (onea === null) {
    card.body('Set your periods here with the Pebble app!');
  }
  else {
    cycleDay = parseInt(Day.substring(4,5));
    console.log(cycleDay);
    switch(cycleDay) {
      case 1:
        if (moment().isBefore(moment().set({'hour': 09, 'minute':15}))) {
          card.body('First period: ' + onea + '.');
        }
        else if (moment().isBefore(moment().set({'hour': 10, 'minute':30}))) {
          card.body('Second period: ' + oneb + '.');
        }
        else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
          card.body('Third period: ' + onec + '.');
        }
        else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
          card.body('Fourth period: ' + oned + '.');
        }
        else {
          console.log(onea);
          card.body('Tomorrow\'s first period: ' + onea + '.');
        }
        break;
      case 2:
        if (moment().isBefore(moment().add(day, 'days').hour(9).minute(15))) {
          card.body('First period: ' + twoa + '.');
        }
        else if (moment().isBefore(moment().hour(10).minute(30))) {
          card.body('Second period: ' + twob + '.');
        }
        else if (moment().isBefore(moment().hour(12).minute(40))) {
          card.body('Third period: ' + twoc + '.');
        }
        else if (moment().isBefore(moment().hour(14).minute(0))) {
          card.body('Fourth period: ' + twod + '.');
        }
        break;
      case 3:
        if (moment().isBefore(moment().add(day, 'days').hour(9).minute(15))) {
          card.body('First period: ' + oneb + '.');
        }
        else if (moment().isBefore(moment().hour(10).minute(30))) {
          card.body('Second period: ' + onea + '.');
        }
        else if (moment().isBefore(moment().hour(12).minute(40))) {
          card.body('Third period: ' + oned + '.');
        }
        else if (moment().isBefore(moment().hour(14).minute(0))) {
          card.body('Fourth period: ' + onec + '.');
        }
        break;
      case 4:
        if (moment().isBefore(moment().add(day, 'days').hour(9).minute(15))) {
          card.body('First period: ' + twob + '.');
        }
        else if (moment().isBefore(moment().hour(10).minute(30))) {
          card.body('Second period: ' + twoa + '.');
        }
        else if (moment().isBefore(moment().hour(12).minute(40))) {
          card.body('Third period: ' + twod + '.');
        }
        else if (moment().isBefore(moment().hour(14).minute(0))) {
          card.body('Fourth period: ' + twoc + '.');
        }
        break;
      default:
        console.log('error');
    }
  }
}

//App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = 'http://cbschedulemana.ga/index.html';
  Pebble.openURL(configURL);
  console.log('Settings launched.');
});

// Decode the user's preferences
Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log(configData.onea);
  onea = configData.onea;
  oneb = configData.oneb;
  onea = configData.onec;
  onea = configData.oned;
  twoa = configData.twoa;
  twoa = configData.twoa;
  twoa = configData.twoa;
  twoa = configData.twoa;
  localStorage.setItem('onea', onea);
  localStorage.setItem('oneb', oneb);
  localStorage.setItem('onec', onec);
  localStorage.setItem('oned', oned);
  localStorage.setItem('twoa', twoa);
  localStorage.setItem('twob', twob);
  localStorage.setItem('twoc', twoc);
  localStorage.setItem('twod', twod);
});
var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');
var Vector2 = require('vector2');

// Create a Window to show main information
var mainWind = new UI.Window({
  backgroundColor: 'black'
});

//Colours in top half in blue
var backTop = new UI.Rect({
  size: new Vector2(144, 84),
  backgroundColor: 'blue moon'
});

//Colours in bottom half in green
var backBottom = new UI.Rect({
  size: new Vector2(144, 84),
  position: new Vector2(0, 84),
  backgroundColor: 'jaeger green'
});

//Colours in main area in white
var backMain = new UI.Rect({
  size: new Vector2(120, 146),
  position: new Vector2(11, 12),
  backgroundColor: 'white'
});

//Top of rectangle
var borderTop = new UI.Line({
  position: new Vector2(11,12),
  position2: new Vector2(131, 12),
  strokeColor: 'black',
  strokeWidth: 5
});

//Left of rectangle
var borderLeft = new UI.Line({
  position: new Vector2(11,12),
  position2: new Vector2(11, 156),
  strokeColor: 'black',
  strokeWidth: 5
});

//Right of rectangle
var borderRight = new UI.Line({
  position: new Vector2(131,12),
  position2: new Vector2(131, 156),
  strokeColor: 'black',
  strokeWidth: 5
});

//Bottom of rectangle
var borderBottom = new UI.Line({
  position: new Vector2(11,156),
  position2: new Vector2(131, 156),
  strokeColor: 'black',
  strokeWidth: 5
});

//Today is...
var dayDescription = new UI.Text({
  size: new Vector2(144, 25),
  font: 'gothic-18',
  position: new Vector2(0,22),
  color: 'black',
  text: 'Fetching...',
  textAlign: 'center'
});

//Day
var dayText = new UI.Text({
  size: new Vector2(144, 42),
  font: 'gothic-28-bold',
  position: new Vector2(0, 40),
  color: 'black',
  text: '...',
  textAlign: 'center'
});

//Next period is...
var periodDescription = new UI.Text({
  size: new Vector2(144, 25),
  font: 'gothic-18',
  position: new Vector2(0, 90),
  color: 'black',
  text: 'Fetching...',
  textAlign: 'center'
});

//French or English or whatever
var periodText = new UI.Text({
  size: new Vector2(100, 35),
  font: 'gothic-28-bold',
  position: new Vector2(22, 110),
  color: 'black',
  text: '...',
  textAlign: 'center',
  textOverflow: 'ellipsis'
});

//Center separation lines
var separatorLines = new UI.Text({
  size: new Vector2(100, 35),
  font: 'gothic-18',
  position: new Vector2(22, 71),
  color: 'black',
  text: '- - - - - - - - - - -',
  textAlign: 'center',
});

// Display the Card
mainWind.add(backTop);
mainWind.add(backBottom);
mainWind.add(backMain);
mainWind.add(borderTop);
mainWind.add(borderLeft);
mainWind.add(borderRight);
mainWind.add(borderBottom);
mainWind.add(dayDescription);
mainWind.add(dayText);
mainWind.add(periodDescription);
mainWind.add(periodText);
mainWind.add(separatorLines);
mainWind.show();

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
var online = true;
var Day = 'day';
var dateFetched = 'date';
var timesSkipped = '0';

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
      url: URL + "&timeMin=" + start + "&timeMax=" + end
    },
    function(data) {
      // Success!
      
      // Extract data and save
      Day = FindDay(data);
  
      // Interpret data; try next day if not school day
      if (Day == 'no school') {
        timesSkipped++;
        if (timesSkipped <30) {
        daySkipped ++;
        start = moment().startOf('day').add(daySkipped, 'days').format();
        end = moment().endOf('day').add(daySkipped, 'days').format();
        request();
        } else {
          dayDescription.text('Sum ting wong.');
          dayText.text('Uh oh.');
          periodDescription.text('Not good.');
          periodText.text(':(');
        }
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
      online = false;
      Day = localStorage.getItem('Day');
      dateFetched = localStorage.getItem('dateFetched');
      var timeShown = moment(dateFetched).format('ddd Do MMMM');
      if (moment().isAfter(dateFetched, 'day')) {
        dayDescription.text(timeShown + ' was a');
        dayText.text(Day);
        periodDescription.text('You\'re offline!');
        periodText.text(':(');
      }
      else {
        dayDescription.text(timeShown + ' is a');
        dayText.text(Day);
        setPeriod(parseInt(Day.substring(4,5)));
      }
    }
  );
}

//Gets the Day from JSON
function FindDay(data) {
  if (moment().isAfter(moment().hours(15).minutes(15)) && skipped === false) {
    console.log('skipped');
    skipped = true;
    return 'no school';
  } else if (data.search('Day') >= 0) {
      console.log('Day found');
      for (var i=0; i<data.length; i++) {
        console.log(i);
        if (isNaN(parseInt(data.substring(data.indexOf('Day', i) + 4, data.indexOf('Day', i) + 5))) === false) {
          console.log(data.substring(data.indexOf('Day', i), data.indexOf('Day', i) + 5));
          return data.substring(data.indexOf('Day', i), data.indexOf('Day', i)+ 5);
        } else {
          if (data.indexOf('Day', i + 1) > 0) {
            i = data.indexOf('Day', i + 1) - 1;
          } else {
            { break; }
          }
        }
        }
      console.log('*gasp* fake day');
      return 'no school';
  } else {
    console.log('no day');
    return 'no school';
  }
}

//Displays day to user
function display(day) {
  switch(day) {
    case 0:
      dayDescription.text('It\'s a');
      dayText.text(Day.toUpperCase());
      break;
    case 1:
      dayDescription.text('Tomorrow will be a');
      dayText.text(Day.toUpperCase());
      break;
    default:
      dayDescription.text(moment().add(day, 'days').format("ddd ") + moment().add(day, 'days').format("Do") + ' will be a');
      dayText.text(Day.toUpperCase());
  }
}

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
    periodDescription.text('Set your periods');
    periodText.text('IN THE APP!');
  }
  else {
    if (moment().isBefore(moment().set({'hour': 09, 'minute':15})) || moment().isAfter(moment().set({'hour': 21, 'minute':0})) && online) {
      periodDescription.text('First period');
      periodText.text(Periods[0].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 10, 'minute':35}))) {
      periodDescription.text('Second period');
      periodText.text(Periods[1].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
      periodDescription.text('Third period');
      periodText.text(Periods[2].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
      periodDescription.text('Fourth period');
      periodText.text(Periods[3].toUpperCase());
    }
    else {
      periodDescription.text('School is...');
      periodText.text('DONE!');
    }
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
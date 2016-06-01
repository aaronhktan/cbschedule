var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var dayFinder = require('dayFinder.js');
var periodSetter = require('periodSetter.js');
var itemSetter = require('itemSetter.js');
var titleSetter = require('titleSetter.js');

// Create a Window to show main information
var mainWind = new UI.Window({
  backgroundColor: 'black'
});

//Colours in top half in blue
var backTop = new UI.Rect({
  size: new Vector2(Feature.resolution().x, Feature.resolution().y / 2),
  backgroundColor: 'blue moon'
});

//Colours in bottom half in green
var backBottom = new UI.Rect({
  size: new Vector2(Feature.resolution().x, Feature.resolution().y / 2),
  position: new Vector2(0, Feature.resolution().y / 2),
  backgroundColor: 'jaeger green'
});

//Colours in main area in white
var backMain = Feature.rectangle(new UI.Rect({
  size: new Vector2(Feature.resolution().x - 24, Feature.resolution().y - 24),
  position: new Vector2(12 , 12),
  backgroundColor: 'white',
  borderWidth: 5,
  borderColor: 'black'
}), new UI.Circle({
  radius: Feature.resolution().x / 2 - 12,
  position: new Vector2(Feature.resolution().x / 2, Feature.resolution().y /2),
  backgroundColor: 'white',
  borderWidth: 5,
  borderColor: 'black'
}));

//Today is...
var dayDescription = new UI.Text({
  size: new Vector2(Feature.resolution().x, 18),
  font: 'gothic-18',
  position: Feature.rectangle(new Vector2(0, Feature.resolution().y / 4 - 20),
                              new Vector2(0, Feature.resolution().y / 4 - 10)),
  color: 'black',
  text: 'Fetching...',
  textAlign: 'center',
});

//Day
var dayText = new UI.Text({
  size: new Vector2(Feature.resolution().x, 28),
  font: 'gothic-28-bold',
  position: Feature.rectangle(new Vector2(0, Feature.resolution().y / 4),
                              new Vector2(0, Feature.resolution().y / 4 + 5)),
  color: 'black',
  text: '...',
  textAlign: 'center',
});

//Next period is...
var periodDescription = new UI.Text({
  size: new Vector2(Feature.resolution().x, 18),
  font: 'gothic-18',
  position: Feature.rectangle(new Vector2(0, Feature.resolution().y * 0.75 - 35),
                              new Vector2(0, Feature.resolution().y * 0.75 - 40)),
  color: 'black',
  text: 'Fetching...',
  textAlign: 'center',
});

//French or English or whatever
var periodText = new UI.Text({
  size: Feature.rectangle(new Vector2(Feature.resolution().x, 28),
                          new Vector2(Feature.resolution().x / 2, 28)),
  font: 'gothic-28-bold',
  position: Feature.rectangle(new Vector2(0, Feature.resolution().y * 0.75 - 15),
                              new Vector2(Feature.resolution().x / 4, Feature.resolution().y * 0.75 - 25)),
  color: 'black',
  text: '...',
  textAlign: 'center',
  textOverflow: 'ellipsis',
});

//Center separation lines
var separatorLines = new UI.Text({
  size: new Vector2(Feature.resolution().x - 44, 18),
  font: 'gothic-18',
  position: new Vector2(22, Feature.resolution().y / 2 - 13),
  color: 'black',
  text: '- - - - - - - - - - -',
  textAlign: 'center',
});

// Display the Card
mainWind.add(backTop);
mainWind.add(backBottom);
mainWind.add(backMain);
mainWind.add(dayDescription);
mainWind.add(dayText);
mainWind.add(periodDescription);
mainWind.add(periodText);
mainWind.add(separatorLines);
mainWind.show();

// Construct periods
var periods = [
  localStorage.getItem('onea'),
  localStorage.getItem('oneb'),
  localStorage.getItem('onec'),
  localStorage.getItem('oned'),
  localStorage.getItem('twoa'),
  localStorage.getItem('twob'),
  localStorage.getItem('twoc'),
  localStorage.getItem('twod'),
];
var online = true;
var currentPeriod = 4;
var Day = 'day';
var dateFetched = localStorage.getItem('dateFetched');
var timesSkipped = 0;

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
      Day = dayFinder.findDay(data);
  
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
        localStorage.setItem('dateFetched', moment().
                             add(daySkipped, 'days').format('YYYY-MM-DD'));
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
      var timeShown = moment(dateFetched).format('ddd Do');
      if (moment().isAfter(dateFetched, 'day')) {
        dayDescription.text(timeShown + ' was a');
        dayText.text(Day);
        periodDescription.text('You\'re offline!');
        periodText.text(':(');
      } else if (moment().isSame(dateFetched, 'day')) {
        dayDescription.text(timeShown + ' is a');
        dayText.text(Day.toUpperCase());
        setPeriod(parseInt(Day.substring(4,5)));
      } else {
        dayDescription.text(timeShown + ' will be a');
        dayText.text(Day.toUpperCase());
        setPeriod(parseInt(Day.substring(4,5)));
      }
    }
  );
}

//Displays day to user
function display(day) {
  switch(day) {
    case 0:
      dayDescription.text('It\'s a');
      dayText.text(Day.toUpperCase());
      break;
    case 1:
      dayDescription.text('Tomorrow\'s a');
      dayText.text(Day.toUpperCase());
      break;
    default:
      dayDescription.text(moment().add(day, 'days').format("ddd ") + 
                          moment().add(day, 'days').format("Do") + ' will be a');
      dayText.text(Day.toUpperCase());
  }
}

//Displays periods by setting according to day
function setPeriod(day) {
  if (periods[0] === null) {
    periodDescription.text('Set your periods');
    var setupText = 'IN THE APP!';
    if (Feature.round()) {
      setupText = 'IN-APP!';
    }
    console.log(setupText);
    periodText.text(setupText);
  }
  else {
    if (moment().isBefore(moment().set({'hour': 09, 'minute':15})) || 
        moment().isBefore(moment(dateFetched, 'YYYY-MM-DD'))) {
      if (day == 1 || day == 2) {
        currentPeriod = 0;
      } else {
        currentPeriod = 1;
      }
      console.log('Period 1');
      periodDescription.text('First period');
      periodText.text(periods[periodSetter.setPeriod(day)[0]].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 10, 'minute':35}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 0;
      } else {
        currentPeriod = 1;
      }
      console.log('Period 2');
      periodDescription.text('Second period');
      periodText.text(periods[periodSetter.setPeriod(day)[1]].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 1;
      } else {
        currentPeriod = 0;
      }
      console.log('Period 3');
      periodDescription.text('Third period');
      periodText.text(periods[periodSetter.setPeriod(day)[2]].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 2;
      } else {
        currentPeriod = 3;
      }
      console.log('Period 3');
      periodDescription.text('Fourth period');
      periodText.text(periods[periodSetter.setPeriod(day)[3]].toUpperCase());
    }
    else {
      if (day == 1 || day == 2) {
        currentPeriod = 3;
      } else {
        currentPeriod = 2;
      }
      console.log('Period 4');
      periodDescription.text('No next class!');
      periodText.text('DONE!');
    }
  }
}

//Shows schedule
var periodCodes = [
    localStorage.getItem('oneacode'),
    localStorage.getItem('onebcode'),
    localStorage.getItem('oneccode'),
    localStorage.getItem('onedcode'),
    localStorage.getItem('twoacode'),
    localStorage.getItem('twobcode'),
    localStorage.getItem('twoccode'),
    localStorage.getItem('twodcode'),
];
function showSchedule() {
  console.log('clicked!');
  console.log(Number(Day.substring(4,5)) + 1);
  var scheduleMenu = new UI.Menu({
    highlightBackgroundColor: Feature.color('blue moon', 'black'),
    sections: [{
      title: titleSetter.setTitle(parseInt(Day.substring(4,5))),
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)))
    }, {
      title: titleSetter.setTitle(parseInt(Day.substring(4,5)) + 1),
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)) + 1)
    }]
  });
  scheduleMenu.status(false);
  scheduleMenu.show();
  scheduleMenu.selection(0, currentPeriod);
}

//App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = "";
  if (periods[0] === null) {
    configURL = 'http://cbschedulemana.ga/index.html';
  }
  else {
    configURL = 'http://cbschedulemana.ga/index.html?' + 
      'onea=' + encodeURIComponent(periods[0]) + '&oneb=' + encodeURIComponent(periods[1]) + '&onec=' + encodeURIComponent(periods[2])+ 
      '&oned=' + encodeURIComponent(periods[3]) + '&twoa=' + encodeURIComponent(periods[4]) + '&twob=' + encodeURIComponent(periods[5]) + 
      '&twoc=' + encodeURIComponent(periods[6]) + '&twod=' + encodeURIComponent(periods[7]);
    if (periodCodes[0] !== null) {
    configURL += '&oneacode=' + encodeURIComponent(periodCodes[0]) +
      '&onebcode=' + encodeURIComponent(periodCodes[1]) + '&oneccode=' + encodeURIComponent(periodCodes[2]) + 
      '&onedcode=' + encodeURIComponent(periodCodes[3]) + '&twoacode=' + encodeURIComponent(periodCodes[4]) +
      '&twobcode=' + encodeURIComponent(periodCodes[5]) + '&twoccode=' + encodeURIComponent(periodCodes[6]) +
      '&twodcode=' + encodeURIComponent(periodCodes[7]);
    }
  }
  Pebble.openURL(configURL);
  console.log(configURL);
});

// Decode the user's preferences
Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log(configData.onea);
  periods[0] = configData.onea;
  periods[1] = configData.oneb;
  periods[2] = configData.onec;
  periods[3] = configData.oned;
  periods[4] = configData.twoa;
  periods[5] = configData.twob;
  periods[6] = configData.twoc;
  periods[7] = configData.twod;
  localStorage.setItem('onea', periods[0]);
  localStorage.setItem('oneb', periods[1]);
  localStorage.setItem('onec', periods[2]);
  localStorage.setItem('oned', periods[3]);
  localStorage.setItem('twoa', periods[4]);
  localStorage.setItem('twob', periods[5]);
  localStorage.setItem('twoc', periods[6]);
  localStorage.setItem('twod', periods[7]);
  localStorage.setItem('oneacode', configData.oneacode);
  localStorage.setItem('onebcode', configData.onebcode);
  localStorage.setItem('oneccode', configData.oneccode);
  localStorage.setItem('onedcode', configData.onedcode);
  localStorage.setItem('twoacode', configData.twoacode);
  localStorage.setItem('twobcode', configData.twobcode);
  localStorage.setItem('twoccode', configData.twoccode);
  localStorage.setItem('twodcode', configData.twodcode);
  request();
});


//Show schedule viewer
mainWind.on('click', 'select', showSchedule);

//Scrolls to next element
var cardIndex = 0;
var created = false;
mainWind.on('click', 'down', function (animateThingsDown) {
  console.log('clicked down!');
  
  //create other elements

  if (created === false) {
      
    //Colours in main area in white
    var backMain2 = Feature.rectangle(new UI.Rect({
      size: new Vector2(Feature.resolution().x - 24, Feature.resolution().y - 24),
      position: new Vector2(12 , Feature.resolution().y + 12),
      backgroundColor: 'white',
      borderWidth: 5,
      borderColor: 'black'
    }), new UI.Circle({
      radius: Feature.resolution().x / 2 - 12,
      position: new Vector2(Feature.resolution().x / 2, Feature.resolution().y + Feature.resolution().y /2),
      backgroundColor: 'white',
      borderWidth: 5,
      borderColor: 'black'
    }));
    
    //Today is...
    var dayDescription2 = new UI.Text({
      size: new Vector2(Feature.resolution().x, 18),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(0, Feature.resolution().y + Feature.resolution().y / 4 - 20),
                                  new Vector2(0, Feature.resolution().y + Feature.resolution().y / 4 - 10)),
      color: 'black',
      text: 'Fetching...',
      textAlign: 'center',
    });
    
    //Day
    var dayText2 = new UI.Text({
      size: new Vector2(Feature.resolution().x, 28),
      font: 'gothic-28-bold',
      position: Feature.rectangle(new Vector2(0, Feature.resolution().y + Feature.resolution().y / 4),
                                  new Vector2(0, Feature.resolution().y + Feature.resolution().y / 4 + 5)),
      color: 'black',
      text: '...',
      textAlign: 'center',
    });
    
    //Next period is...
    var periodDescription2 = new UI.Text({
      size: new Vector2(Feature.resolution().x, 18),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(0, Feature.resolution().y + Feature.resolution().y * 0.75 - 35),
                                  new Vector2(0, Feature.resolution().y + Feature.resolution().y * 0.75 - 40)),
      color: 'black',
      text: 'Fetching...',
      textAlign: 'center',
    });
    
    //French or English or whatever
    var periodText2 = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x, 28),
                              new Vector2(Feature.resolution().x / 2, 28)),
      font: 'gothic-28-bold',
      position: Feature.rectangle(new Vector2(0, Feature.resolution().y + Feature.resolution().y * 0.75 - 15),
                                  new Vector2(Feature.resolution().x / 4, Feature.resolution().y + Feature.resolution().y * 0.75 - 25)),
      color: 'black',
      text: '...',
      textAlign: 'center',
      textOverflow: 'ellipsis',
    });
    
    //Center separation lines
    var separatorLines2 = new UI.Text({
      size: new Vector2(Feature.resolution().x - 44, 18),
      font: 'gothic-18',
      position: new Vector2(22, Feature.resolution().y + Feature.resolution().y / 2 - 13),
      color: 'black',
      text: '- - - - - - - - - - -',
      textAlign: 'center',
    });
    
    // Display the Card
    mainWind.add(backMain2);
    mainWind.add(dayDescription2);
    mainWind.add(dayText2);
    mainWind.add(periodDescription2);
    mainWind.add(periodText2);
    mainWind.add(separatorLines2);
    created = true;
  }

  
//Animate the elements down
  if (cardIndex === 0) {
    mainWind.each(function (element) {
    if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') {
                element.animate('position', new Vector2(element.position().x, element.position().y -= Feature.resolution().y), 150);
    }});
    cardIndex = 1;
  }
});

//Animate the elements up
mainWind.on('click', 'up', function (animateThingsUp) {
  if (cardIndex == 1) {
    mainWind.each(function (element) {
    if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') {
                element.animate('position', new Vector2(element.position().x, element.position().y += Feature.resolution().y), 150);
    }});
    cardIndex = 0;
  }
  console.log('clicked up!');
});
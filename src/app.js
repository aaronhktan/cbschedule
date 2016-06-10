var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var dayFinder = require('dayFinder.js');
var periodSetter = require('periodSetter.js');
var itemSetter = require('itemSetter.js');
var titleSetter = require('titleSetter.js');

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


// Create a Window to show main information
var mainWind = new UI.Window({
  backgroundColor: 'black'
});

mainWind.add(backTop);
mainWind.add(backBottom);

//Create arrays to hold elements
var backMain = [];
var dayDescription = [];
var dayText = [];
var periodDescription = [];
var periodText = [];
var separatorLines = [];

//Creates elements that display the day to the user
function createElements(user, cardIndex) {
  
  //Colours in main area in white
  backMain[cardIndex] = Feature.rectangle(new UI.Rect({
    size: new Vector2(Feature.resolution().x - 24, Feature.resolution().y - 24),
    position: new Vector2(12 , Feature.resolution().y * user + 12),
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black'
  }), new UI.Circle({
    radius: Feature.resolution().x / 2 - 12,
    position: new Vector2(Feature.resolution().x / 2, Feature.resolution().y * user + Feature.resolution().y /2),
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'black'
  }));

  //Today is...
  dayDescription[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x, 18),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(0, Feature.resolution().y * user + Feature.resolution().y / 4 - 20),
                                new Vector2(0, Feature.resolution().y * user + Feature.resolution().y / 4 - 10)),
    color: 'black',
    text: 'Fetching...',
    textAlign: 'center',
  });

  //Day
  dayText[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x, 28),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(0, Feature.resolution().y * user + Feature.resolution().y / 4),
                                new Vector2(0, Feature.resolution().y * user + Feature.resolution().y / 4 + 5)),
    color: 'black',
    text: '...',
    textAlign: 'center',
  });

  //Next period is...
  periodDescription[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x, 18),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(0, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 35),
                                new Vector2(0, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 40)),
    color: 'black',
    text: 'Fetching...',
    textAlign: 'center',
  });

  //French or English or whatever
  periodText[cardIndex] = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x, 28),
                            new Vector2(Feature.resolution().x / 2, 28)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(0, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 15),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 25)),
    color: 'black',
    text: '...',
    textAlign: 'center',
    textOverflow: 'ellipsis',
  });

//Center separation lines
  separatorLines[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x - 44, 18),
    font: 'gothic-18',
    position: new Vector2(22, Feature.resolution().y * user + Feature.resolution().y / 2 - 13),
    color: 'black',
    text: '- - - - - - - - - - -',
    textAlign: 'center',
  });

  // Add elements to the window
  mainWind.add(backMain[cardIndex]);
  mainWind.add(dayDescription[cardIndex]);
  mainWind.add(dayText[cardIndex]);
  mainWind.add(periodDescription[cardIndex]);
  mainWind.add(periodText[cardIndex]);
  mainWind.add(separatorLines[cardIndex]);
}

//Show the card
var cardIndex = 0;
createElements(0, cardIndex);
mainWind.show();

// Construct periods
var periods = [];
var users = localStorage.getItem('users');
for (var i = 0; i<= users*16+15; i++) {
  periods[i] = localStorage.getItem(i.toString());
  console.log(periods[i]);
}
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
        dayDescription[cardIndex].text(timeShown + ' was a');
        dayText[cardIndex].text(Day);
        periodDescription[cardIndex].text('You\'re offline!');
        periodText[cardIndex].text(':(');
      } else if (moment().isSame(dateFetched, 'day')) {
        dayDescription[cardIndex].text(timeShown + ' is a');
        dayText[cardIndex].text(Day.toUpperCase());
        setPeriod(parseInt(Day.substring(4,5)));
      } else {
        dayDescription[cardIndex].text(timeShown + ' will be a');
        dayText[cardIndex].text(Day.toUpperCase());
        setPeriod(parseInt(Day.substring(4,5)));
      }
    }
  );
}

//Displays day to user
function display(day) {
  switch(day) {
    case 0:
      dayDescription[cardIndex].text('It\'s a');
      dayText[cardIndex].text(Day.toUpperCase());
      break;
    case 1:
      dayDescription[cardIndex].text('Tomorrow\'s a');
      dayText[cardIndex].text(Day.toUpperCase());
      break;
    default:
      dayDescription[cardIndex].text(moment().add(day, 'days').format("ddd ") + 
                          moment().add(day, 'days').format("Do") + ' will be a');
      dayText[cardIndex].text(Day.toUpperCase());
  }
}

//Displays periods by setting according to day
function setPeriod(day) {
  if (periods[0] === null) {
    periodDescription[cardIndex].text('Set your periods');
    var setupText = 'IN THE APP!';
    if (Feature.round()) {
      setupText = 'IN-APP!';
    }
    console.log(setupText);
    periodText[cardIndex].text(setupText);
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
      periodDescription[cardIndex].text('First period');
      periodText[cardIndex].text(periods[periodSetter.setPeriod(day, cardIndex)[0]].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 10, 'minute':35}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 0;
      } else {
        currentPeriod = 1;
      }
      console.log('Period 2');
      periodDescription[cardIndex].text('Second period');
      periodText[cardIndex].text(periods[periodSetter.setPeriod(day, cardIndex)[1]].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 1;
      } else {
        currentPeriod = 0;
      }
      console.log('Period 3');
      periodDescription[cardIndex].text('Third period');
      periodText[cardIndex].text(periods[periodSetter.setPeriod(day, cardIndex)[2]].toUpperCase());
    }
    else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 2;
      } else {
        currentPeriod = 3;
      }
      console.log('Period 3');
      periodDescription[cardIndex].text('Fourth period');
      periodText[cardIndex].text(periods[periodSetter.setPeriod(day, cardIndex)[3]].toUpperCase());
    }
    else {
      if (day == 1 || day == 2) {
        currentPeriod = 3;
      } else {
        currentPeriod = 2;
      }
      console.log('Period 4');
      periodDescription[cardIndex].text('No next class!');
      periodText[cardIndex].text('DONE!');
    }
  }
}

//Shows schedule
function showSchedule() {
  console.log('clicked!');
  console.log(Number(Day.substring(4,5)) + 1);
  var scheduleMenu = new UI.Menu({
    highlightBackgroundColor: Feature.color('blue moon', 'black'),
    sections: [{
      title: titleSetter.setTitle(parseInt(Day.substring(4,5))),
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)), cardIndex)
    }, {
      title: titleSetter.setTitle(parseInt(Day.substring(4,5)) + 1),
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)) + 1, cardIndex)
    }]
  });
  scheduleMenu.status(false);
  scheduleMenu.show();
  scheduleMenu.selection(0, currentPeriod);
}

//App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = 'http://cbschedulemana.ga/index.html';
  if (users !== null && periods[0] !== null) {
    configURL += "?users=" + users;
    for (var i = 0; i <= periods.length; i++) {
      configURL += "&" + i + "=" + encodeURIComponent(periods[i]);
    }
  }
  Pebble.openURL(configURL);
  console.log(configURL);
});

// Decode the user's preferences
Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  console.log(configData[0]);
  users = configData[configData.length - 1];
  localStorage.setItem('users', users);
  console.log(users);
  for (var i = 0; i <= configData.length; i++) {
    periods[i] = configData[i];
    console.log(configData[i]);
    localStorage.setItem(i.toString(), periods[i]);
  }
  request();
});


//Show schedule viewer
mainWind.on('click', 'select', showSchedule);

//Scrolls to next element
var created = [];
mainWind.on('click', 'down', function (animateThingsDown) {
  cardIndex += 1;
  //create other elements
  if (created[cardIndex] !== true && cardIndex <= users) {
    createElements(1, cardIndex);
    created[cardIndex] = true;
    display(daySkipped);
    setPeriod(parseInt(Day.substring(4,5)));
  }
  
  //Animate the elements down
  if (cardIndex <= users) {
    mainWind.each(function (element) {
      if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') {
        element.animate('position', new Vector2(element.position().x, element.position().y -= Feature.resolution().y), 500);
      }});
    
  } else {
    cardIndex -= 1;
  }

  console.log('clicked down! to card #' + cardIndex);
});

//Scrolls to previous element
mainWind.on('click', 'up', function (animateThingsUp) {
  if (cardIndex >= 1) {
    mainWind.each(function (element) {
    if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') {
                element.animate('position', new Vector2(element.position().x, element.position().y += Feature.resolution().y), 500);
    }});
    cardIndex -= 1;
  }
  console.log('clicked up! to card #' + cardIndex);
});
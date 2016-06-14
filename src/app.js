var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var dayFinder = require('dayFinder.js');
var periodSetter = require('periodSetter.js');
var itemSetter = require('itemSetter.js');
var titleSetter = require('titleSetter.js');
var imageSetter = require('imageSetter.js');

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

//Creates elements that display the day and/or periods to the user
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
    size: new Vector2(Feature.resolution().x - 48, 28),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(24, Feature.resolution().y * user + Feature.resolution().y / 4),
                                new Vector2(24, Feature.resolution().y * user + Feature.resolution().y / 4 + 5)),
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
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 48, 28),
                            new Vector2(Feature.resolution().x / 2, 28)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(24, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 15),
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
var users = localStorage.getItem('users');
var usernames = [];
for (var i = 0; i < parseInt(users); i++) {
  usernames[i] = (localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
  console.log(localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
}
var periods = [];
for (i = 0; i <= (users * 8 + 7); i++) {
  periods[i] = JSON.parse(localStorage.getItem(i.toString()));
}
var online = true;
var working = true;
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
        if (timesSkipped < 9) {
        daySkipped ++;
        start = moment().startOf('day').add(daySkipped, 'days').format();
        end = moment().endOf('day').add(daySkipped, 'days').format();
        request();
        } else {
          working = false;
          dayDescription[cardIndex].text('Sum ting wong.');
          dayText[cardIndex].text('Uh oh.');
          periodDescription[cardIndex].text('Not good.');
          periodText[cardIndex].text(':(');
          Day = 'Day 1';
          currentPeriod = 0;
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
function setPeriod(day, current) {
  //No periods are set
  if (periods[0] === null) {
    periodDescription[cardIndex].text('Set your periods');
    var setupText = 'IN-APP!';
    console.log(setupText);
    periodText[cardIndex].text(setupText);
  }
  else {
    //If before 9:15, or is before the next school day, shows first period
    if (moment().isBefore(moment().set({'hour': 09, 'minute':15})) || 
        moment().isBefore(moment(dateFetched, 'YYYY-MM-DD'))) {
      if (day == 1 || day == 2) {
        currentPeriod = 0;
      } else {
        currentPeriod = 1;
      }
      console.log('Period 1');
      if (current) {
        dayDescription[cardIndex].text('Current period');
        dayText[cardIndex].text('NONE!');
      }
      periodDescription[cardIndex].text('First period');
      periodText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[0]].name).toUpperCase());
    }
    //If before start of second period, shows second period
    else if (moment().isBefore(moment().set({'hour': 10, 'minute':35}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 0;
      } else {
        currentPeriod = 1;
      }
      console.log('Period 2');
      if (current) {
        dayDescription[cardIndex].text('Current period');
        dayText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[0]].name).toUpperCase());
      }
      periodDescription[cardIndex].text('Second period');
      periodText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[1]].name).toUpperCase());
    }
    //If before start of third period, shows third period
    else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 1;
      } else {
        currentPeriod = 0;
      }
      console.log('Period 3');
      if (current) {
        dayDescription[cardIndex].text('Current period');
        dayText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[1]].name).toUpperCase());
      }
      periodDescription[cardIndex].text('Third period');
      periodText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[2]].name).toUpperCase());
    }
    //If before start of fourth period, shows fourth period
    else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
      if (day == 1 || day == 2) {
        currentPeriod = 2;
      } else {
        currentPeriod = 3;
      }
      console.log('Period 3');
      if (current) {
        dayDescription[cardIndex].text('Current period');
        dayText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[2]].name).toUpperCase());
      }
      periodDescription[cardIndex].text('Fourth period');
      periodText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[3]].name).toUpperCase());
    }
    //Otherwise, assume it's outside of school hours and show that there is no class left.
    else {
      if (day == 1 || day == 2) {
        currentPeriod = 3;
      } else {
        currentPeriod = 2;
      }
      console.log('Period 4');
      if (current) {
        dayDescription[cardIndex].text('Current period');
        if (moment().isAfter(moment().set({'hour': 15, 'minute':15}))) {
          dayText[cardIndex].text('NONE!');
        } else {
          dayText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[3]].name).toUpperCase());
        }
      }
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
  var selection = (working) ? currentPeriod:0;
  scheduleMenu.selection(0, selection);
  scheduleMenu.on('select', function showScheduleDetails(e) {
    //Shows additional details about classes when selected
    console.log('The period is ' + e.item.title.substring(4));
    var backExtraDetail = new UI.Window({
    backgroundColor: 'jaeger green',
    status: false
  });
    createExtraDetailWindow(e, backExtraDetail);
    backExtraDetail.show();
                  });
  scheduleMenu.on('back', function showScheduleDetails(e) {
    mainWind.show();
    scheduleMenu.hide();
  });
}
  
//App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = 'http://cbschedulemana.ga/index.html';
  if (users !== null && periods[0] !== null) {
    configURL += "?users=" + users;
    if (users !== 0) {
      for (i = 0; i < users; i++) {
        configURL += "&user" + i + "=" + usernames[i];
      }
    }
    for (i = 0; i < (periods.length * 4 - 1); i += 4) {
      configURL += "&" + i + "=" + encodeURIComponent(String(periods[i / 4].name)) +
        "&" + (i + 1) + "=" + encodeURIComponent(String(periods[i / 4].code)) +
        "&" + (i + 2) + "=" + encodeURIComponent(String(periods[i / 4].teacher)) +
        "&" + (i + 3) + "=" + encodeURIComponent(String(periods[i / 4].room));
    }
}
  Pebble.openURL(configURL);
  console.log(configURL);
});

// Decode the user's preferences
Pebble.addEventListener('webviewclosed', function(e) {
  var configData = JSON.parse(decodeURIComponent(e.response));
  users = configData[configData.length - 1];
  for (var i = 0; i < users; i++) {
    localStorage.setItem(String(8 * (users + 1) + i), configData[8 * (users + 1) + i]);
    usernames[i] = localStorage.getItem(String(8 * (users + 1) + i));
    console.log(usernames[i]);
  }
  localStorage.setItem('users', users);
  console.log(users);
  for (i = 0; i < configData.length - (users + 1); i++) {
    localStorage.setItem(i.toString(), JSON.stringify(configData[i]));
    periods[i] = JSON.parse(localStorage.getItem(i.toString()));
  }
  request();
});


//Show schedule viewer
mainWind.on('click', 'select', showSchedule);

//Scrolls to next element
var created = [];
mainWind.on('click', 'down', function (animateThingsDown) {
  cardIndex += 1;
  //Create other elements
  if (created[cardIndex] !== true && cardIndex <= users) {
    createElements(1, cardIndex);
    created[cardIndex] = true;
    setPeriod(parseInt(Day.substring(4,5)), true);
  }
  
  //Animate the elements down
  if (cardIndex <= users) {
    mainWind.each(function (element) {
      if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') {
        element.animate('position', new Vector2(element.position().x, element.position().y -= Feature.resolution().y), 150);
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
                element.animate('position', new Vector2(element.position().x, element.position().y += Feature.resolution().y), 150);
    }});
    cardIndex -= 1;
  }
  console.log('clicked up! to card #' + cardIndex);
});

function createExtraDetailWindow(e, window) {
  
  var classCodeText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                           new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 38),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 + 38)),
    text: e.item.subtitle,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  
  var classText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                           new Vector2(Feature.resolution().x / 2, 42)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 66),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 - 66)),
    text: e.item.title.substring(4),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  
  var classTeacherText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                           new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 80),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 - 80)),
    text: (String(periods[periodSetter.setPeriod(parseInt(e.section.title.substring(4, 5)), cardIndex)[e.itemIndex]].teacher).toUpperCase()),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  
  var classRoomsText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                           new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 55),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 + 55)),
    text: (String(periods[periodSetter.setPeriod(parseInt(e.section.title.substring(4, 5)), cardIndex)[e.itemIndex]].room).toUpperCase()),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  

  var centerImage = new UI.Image({
    size: new Vector2(64, 64),
    position: new Vector2(Feature.resolution().x / 2 - 32, Feature.resolution().y / 2 - 32),
    image: imageSetter.setImage(String(e.item.title.substring(4))),
    compositing: 'set'
  });
  
  if (e.item.title.substring(4).length < 8 && (String(periods[periodSetter.setPeriod(parseInt(e.section.title.substring(4, 5)), cardIndex)[e.itemIndex]].teacher)).length < 11) {
    var backTriangle = new UI.Text({
    size: new Vector2(42, 42),
    position: new Vector2(12, 0),
    text: '<',
    color: 'black',
    textAlign: 'left'
    });
    window.add(backTriangle);
  }

  window.add(classCodeText);
  window.add(classText);
  window.add(classTeacherText);
  window.add(classRoomsText);
  window.add(centerImage);
}
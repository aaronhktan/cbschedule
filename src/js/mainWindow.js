var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var Wakeup = require('wakeup');
var dayFinder = require('dayFinder.js');
var periodSetter = require('periodSetter.js');
var timelineModule = require('timelineModule.js');
var wakeupModule = require('wakeupModule.js');
var scheduleMenu = require('scheduleMenu.js');
var easterEggWindow = require('easterEggWindow.js');

// ******************************************************************************************* UI Elements
// Colours in top half in blue
var backTop = new UI.Rect({
  size: new Vector2(Feature.resolution().x, Feature.resolution().y / 2),
  backgroundColor: 'blue moon'
});

// Colours in bottom half in green
var backBottom = new UI.Rect({
  size: new Vector2(Feature.resolution().x, Feature.resolution().y / 2),
  position: new Vector2(0, Feature.resolution().y / 2),
  backgroundColor: 'jaeger green'
});


// Create a Window to show main information
var mainWind = new UI.Window({
  backgroundColor: 'black'
});

// Create arrays to hold elements of UI (specifically cards) for different users
var backMain = [];
var dayDescription = [];
var dayText = [];
var periodDescription = [];
var periodText = [];
var separatorLines = [];

// Creates elements that display the day and/or periods to the user. Mostly self-explanatory.
function createElements(user, cardIndex) {
  
  // Colours in main area in white. This is the main rectangle in the UI.
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

  // Textbox that holds the text of Today is...
  dayDescription[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x, 18),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(0, Feature.resolution().y * user + Feature.resolution().y / 4 - 20),
                                new Vector2(0, Feature.resolution().y * user + Feature.resolution().y / 4 - 10)),
    color: 'black',
    text: 'Fetching...',
    textAlign: 'center',
  });

  // Textbox that shows the Day
  dayText[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x - 48, 28),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(24, Feature.resolution().y * user + Feature.resolution().y / 4),
                                new Vector2(24, Feature.resolution().y * user + Feature.resolution().y / 4 + 5)),
    color: 'black',
    text: '...',
    textAlign: 'center',
  });

  // Textbox that hold the text Next period is...
  periodDescription[cardIndex] = new UI.Text({
    size: new Vector2(Feature.resolution().x, 18),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(0, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 35),
                                new Vector2(0, Feature.resolution().y * user + Feature.resolution().y * 0.75 - 40)),
    color: 'black',
    text: 'Fetching...',
    textAlign: 'center',
  });

  // Textbox that shows subjects, eg. French or English or whatever
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

// Center separation lines
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

// Set the app to start at the first user (0-index)
var cardIndex = 0;

// ******************************************************************************************* Get the day
// Get periods and users' names from local storage on phone
var users = localStorage.getItem('users');
// Gets user' names from storage
var usernames = ['Somebody', 'Somebody else'];
// Assigns users to the username array
for (var i = 0; i < parseInt(users); i++) {
  usernames[i] = localStorage.getItem(String(8 * (parseInt(users) + 1) + i));
  console.log(localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
}
// Gets periods from storage
var periods = [];
for (i = 0; i <= (users * 8 + 7); i++) {
  periods[i] = JSON.parse(localStorage.getItem(i.toString()));
}
var online = true; // Determines whether the user is online or not
var working = true; // Determines whether the calendar is on or not
var currentPeriod = 0;
var Day = 'day';
var dateFetched = localStorage.getItem('dateFetched'); // Gets the date the last time the Day was fetched
var timesSkipped = 0; // Used to keep track of how many times 'no day' there have been

// Construct URL
var URL = '';
var daySkipped = 0;
var start = moment().startOf('day').format();
var end = moment().endOf('day').format();

function fetchURL() {
    ajax(
    {
      url: 'http://cbschedulemana.ga/url.json'
    },
    function(data) {
      // Extract data
      var json = JSON.parse(data);
  
      // Get calendar URL from data
      if (json.hasOwnProperty('url')) {
        URL = json.url;
      }
      request();
    },
    function(error) {
      // Failure!
      if (localStorage.getItem('Day') === null) { // This means that the user does not have a day that was fetched in local storage
        dayDescription[cardIndex].text('You\'re offline!');
        dayText[cardIndex].text(':(');
        periodDescription[cardIndex].text('Check again later!');
        periodText[cardIndex].text(':(');
        console.log('There is no date stored!');
      } else {console.log('Failed fetching schedule data: ' + error);
        console.log('The day is ' + localStorage.getItem('Day')); // Shows the day that was last fetched from local storage
        online = false;
        Day = localStorage.getItem('Day');
        dateFetched = localStorage.getItem('dateFetched');
        var timeShown = moment(dateFetched).format('ddd Do');
        if (moment().isAfter(dateFetched, 'day')) {
          dayDescription[cardIndex].text(timeShown + ' was a');
          dayText[cardIndex].text(Day); // Shows the day
          periodDescription[cardIndex].text('You\'re offline!');
          periodText[cardIndex].text(':(');
        } else if (moment().isSame(dateFetched, 'day')) { // If the date is the same, use the data.
          dayDescription[cardIndex].text(timeShown + ' is a');
          dayText[cardIndex].text(Day.toUpperCase());
          setPeriod(parseInt(Day.substring(4,5)));
        } else { // If the date is in the future, use the date.
          dayDescription[cardIndex].text(timeShown + ' will be a');
          dayText[cardIndex].text(Day.toUpperCase());
          setPeriod(parseInt(Day.substring(4,5)));
        }
      }
    }
  );
}

function request() {
  ajax(
    {
      url: URL + '&timeMin=' + start + '&timeMax=' + end
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
        request(); // Requests again
        } else {
          working = false; // It has been 9 or more days since the calendar has a day, therefore it's likely that it is now a vacation day or break
          dayDescription[cardIndex].text('It\'s vacation!');
          dayText[cardIndex].text(':)');
          periodDescription[cardIndex].text('Or sum ting wong.');
          periodText[cardIndex].text(':(');
          Day = 'Day 1'; // Sets to Day 1 if nothing is working
          currentPeriod = 0; // Sets current period to the first period if nothing is working
        }
      }
      // Show to user if school day
      else {
        localStorage.setItem('Day', Day); // Stores the day in persistent storage
        localStorage.setItem('dateFetched', moment().
                             add(daySkipped, 'days').format('YYYY-MM-DD')); // Stores the date that the day is describing
        console.log(moment().add(daySkipped, 'days').format('YYYY-MM-DD'));
        display(daySkipped);
        setPeriod(parseInt(Day.substring(4,5)));
        dateFetched = localStorage.getItem('dateFetched');
        if (localStorage.getItem('timelinePinIsCreated') != dateFetched + 'true') {
          console.log('timeline pins are being created.');
          timelineModule.putTimelinePin(Day, periods, daySkipped); // Creates and puts timelineModule Pins
        }
      }
    },
    function(error) {
      // Failure!
      if (localStorage.getItem('Day') === null) { // This means that the user does not have a day that was fetched in local storage
        dayDescription[cardIndex].text('You\'re offline!');
        dayText[cardIndex].text(':(');
        periodDescription[cardIndex].text('Check again later!');
        periodText[cardIndex].text(':(');
        console.log('There is no date stored!');
      } else {console.log('Failed fetching schedule data: ' + error);
        console.log('The day is ' + localStorage.getItem('Day')); // Shows the day that was last fetched from local storage
        online = false;
        Day = localStorage.getItem('Day');
        dateFetched = localStorage.getItem('dateFetched');
        var timeShown = moment(dateFetched).format('ddd Do');
        if (moment().isAfter(dateFetched, 'day')) {
          dayDescription[cardIndex].text(timeShown + ' was a');
          dayText[cardIndex].text(Day); // Shows the day
          periodDescription[cardIndex].text('You\'re offline!');
          periodText[cardIndex].text(':(');
        } else if (moment().isSame(dateFetched, 'day')) { // If the date is the same, use the data.
          dayDescription[cardIndex].text(timeShown + ' is a');
          dayText[cardIndex].text(Day.toUpperCase());
          setPeriod(parseInt(Day.substring(4,5)));
        } else { // If the date is in the future, use the date.
          dayDescription[cardIndex].text(timeShown + ' will be a');
          dayText[cardIndex].text(Day.toUpperCase());
          setPeriod(parseInt(Day.substring(4,5)));
        }
      }
    }
  );
}

// ******************************************************************************************* Display the Day on the card
// Displays day to user
function display(day) { // Looks at how many days have been skipped and creates text accordingly
  switch(day) {
    case 0: // this means that the day is today
      dayDescription[cardIndex].text('It\'s a');
      dayText[cardIndex].text(Day.toUpperCase());
      break;
    case 1: // This means that the day is tomorrow
      dayDescription[cardIndex].text('Tomorrow\'s a');
      dayText[cardIndex].text(Day.toUpperCase());
      break;
    default: // This means that the day is sometime in the future, but isn't tomorrow
      dayDescription[cardIndex].text(moment().add(day, 'days').format('ddd ') + 
                          moment().add(day, 'days').format('Do') + ' will be a');
      dayText[cardIndex].text(Day.toUpperCase());
  }
}

// ******************************************************************************************* Display the period on the card

function displayPeriod(day, periodNumber, periodNumberString, periodString, current, currentPeriodString) {
  var ogPeriods = [0, 1, 2, 3];
  var notogPeriods = [1, 0, 3, 2];
  if (day == 1 || day == 2) { // Depending on which day it is, the schedule will show a different block
    currentPeriod = ogPeriods[periodNumber];
  } else {
    currentPeriod = notogPeriods[periodNumber];
  }
  if (current) {
      dayDescription[cardIndex].text('Current period');
    if (moment().isAfter(moment().set({'hour': 15, 'minute':15}))) {
      dayText[cardIndex].text('NONE!');
    } else {
      dayText[cardIndex].text(currentPeriodString);
    }
  }
  periodDescription[cardIndex].text(periodNumberString); // Shows the next period; in this case, it's the first period
  periodText[cardIndex].text(periodString);
}

// Displays periods by setting according to day
function setPeriod(day, current) {
  if (periods[0] === null) { // No periods are set; user is told to set up in app
    periodDescription[cardIndex].text('Set your periods');
    var setupText = 'IN-APP!';
    console.log(setupText);
    periodText[cardIndex].text(setupText);
  }
  else {
    // If before 9:15, or is before the next school day, shows first period
    if (moment().isBefore(moment().set({'hour': 09, 'minute':15})) || 
        moment().isBefore(moment(dateFetched, 'YYYY-MM-DD'))) {
      console.log('Period 1');
      displayPeriod(day, 0, 'First period', String(periods[periodSetter.setPeriod(day, cardIndex)[0]].name).toUpperCase(), current, 'NONE!');
    }
    // If before start of second period, shows second period (which is the next period)
    else if (moment().isBefore(moment().set({'hour': 10, 'minute':35}))) {
      console.log('Period 2');
      displayPeriod(day, 0, 'Second period', String(periods[periodSetter.setPeriod(day, cardIndex)[1]].name).toUpperCase(), current, String(periods[periodSetter.setPeriod(day, cardIndex)[0]].name).toUpperCase());
    }
    // If before start of third period, shows third period
    else if (moment().isBefore(moment().set({'hour': 12, 'minute':40}))) {
      console.log('Period 3');
      displayPeriod(day, 1, 'Third period', String(periods[periodSetter.setPeriod(day, cardIndex)[2]].name).toUpperCase(), current, String(periods[periodSetter.setPeriod(day, cardIndex)[1]].name).toUpperCase());
    }
    // If before start of fourth period, shows fourth period
    else if (moment().isBefore(moment().set({'hour': 14, 'minute':0}))) {
      console.log('Period 3');
      displayPeriod(day, 2, 'Fourth period', String(periods[periodSetter.setPeriod(day, cardIndex)[3]].name).toUpperCase(), current, String(periods[periodSetter.setPeriod(day, cardIndex)[2]].name).toUpperCase());
    }
    // Otherwise, assume it's outside of school hours and show that there is no class left.
    else {
      console.log('Period 4');
      displayPeriod(day, 3, 'No next class!', 'DONE!', current, 'NONE!');
    }
  }
}

// ******************************************************************************************* Other user UI Elements
// Scrolls to next element
var created = []; // Keeps track of whether the elements have been created for this user
mainWind.on('click', 'down', function (animateThingsDown) {
  cardIndex += 1; // Adds one to the card number that the user is currently on
  // Create other elements
  if (created[cardIndex] !== true && cardIndex <= users) { // If the card has not previously been created and the user has not reached the last user
    createElements(1, cardIndex); // Things are created!
    created[cardIndex] = true; // Sets that this card has now been created and no longer needs to be created
    setPeriod(parseInt(Day.substring(4,5)), true); // In the card, show the current period and the next period of a friend
  }
  
  // Animate the elements down
  if (cardIndex <= users) {
    mainWind.each(function (element) {
      if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') { // Animates everything down except for background!
        element.animate('position', new Vector2(element.position().x, element.position().y -= Feature.resolution().y), 150);
      }});
  } else {
    cardIndex -= 1; // Because the user is not going down, takes out the cardIndex += 1 at the beginning of this function
  }
  console.log('clicked down! to card #' + cardIndex);
});

// Scrolls to previous element
mainWind.on('click', 'up', function (animateThingsUp) {
  if (cardIndex >= 1) {
    mainWind.each(function (element) {
    if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') { // Same as above
                element.animate('position', new Vector2(element.position().x, element.position().y += Feature.resolution().y), 150);
    }});
    cardIndex -= 1; // Tells program that the card that the user is on is one higher up.
  }
  console.log('clicked up! to card #' + cardIndex);
});

// Sets the button handlers for the main window, to show the schedule when select is clicked
mainWind.on('click', 'select', function() {scheduleMenu.showSchedule(Day, cardIndex, working, currentPeriod);});
mainWind.on('accelTap', function showEasterEggWindow(e) {
  easterEggWindow.createEasterEggWindow(e);
});

// ******************************************************************************************* Settings Handlers

// App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = 'http://cbschedulemana.ga/index.html';
  if (users !== null && periods[0] !== null) { // If the user has opened the settings page before, add parameters to URL in order to prefill it
    configURL += '?users=' + users;
    if (users !== 0) {
      for (i = 0; i < users; i++) {
        configURL += '&user' + i + '=' + usernames[i];
      }
    }
    for (i = 0; i < (periods.length * 4 - 1); i += 4) {
      configURL += '&' + i + '=' + encodeURIComponent(String(periods[i / 4].name)) +
        '&' + (i + 1) + '=' + encodeURIComponent(String(periods[i / 4].code)) +
        '&' + (i + 2) + '=' + encodeURIComponent(String(periods[i / 4].teacher)) +
        '&' + (i + 3) + '=' + encodeURIComponent(String(periods[i / 4].room));
    }
    configURL += '&wakeup=' + localStorage.getItem('wakeup_enabled');
  } else {
    configURL += '?wakeup=' + localStorage.getItem('wakeup_enabled');
  }
  configURL = configURL.split('\'').join('');
  Pebble.openURL(configURL);
  console.log(configURL);
});

// Decode the user's preferences
Pebble.addEventListener('webviewclosed', function(e) {
  /* The returned file is set like this:
  * index 0: User 1 Period 1 {name, course code, teacher name, room number}
  * index 1: User 1 Period 2 {name, course code, teacher name, room number}
  * ...
  * index 6: User 1 Period 7 {name, course code, teacher name, room number}
  * index 7: User 1 Period 8 {name, course code, teacher name, room number}
  * index 8 (user #* 8): User 2 Period 1 {name, course code, teacher name, room number}
  * index 9: User 2 Period 2 {name, course code, teacher name, room number}
  * ...
  * index 16 (user #* 8): User 3 Period 1 {name, course code, teacher name, room number}
  * ...
  * index 24 (total number of users * 8): user name #1
  * index 25 (total number of users * 8 + 1): user name #2
  * index 26 (total number of users * 8 + 2): user name #3
  * index 27 (total number of users * 8 + total number of users): 2 (number of users, starting from index 0)
  * index 27 (enable waking up at 12AM?)
  */
  var configData = JSON.parse(decodeURIComponent(e.response));
  users = configData[configData.length - 2]; // Sets number of users based on the second last element of the array
  var wakeup_enabled = configData[configData.length - 1]; // Sets whether to enable the wakeup module based on the last element of the array
  localStorage.setItem('wakeup_enabled', wakeup_enabled);
  console.log('The wakeup is set to ' + wakeup_enabled);
  if (wakeup_enabled) {
    wakeupModule.scheduleWakeup();
    wakeupModule.wakeupEvent();
  } else {
    Wakeup.cancel('all');
  }
  
  usernames = ['Somebody', 'Somebody else'];
  for (var i = 0; i < parseInt(users); i++) {
    localStorage.setItem(String(8 * (parseInt(users) + 1) + i), configData[8 * (parseInt(users) + 1) + i]); // Sets names of users based on number of users
    usernames[i] = localStorage.getItem(String(8 * (parseInt(users) + 1) + i));
    console.log('username: ' + usernames[i]);
  }
  localStorage.setItem('users', users);
  console.log('users: ' + users);
  for (i = 0; i < configData.length - (users + 1); i++) { // Sets periods based on number of users
    localStorage.setItem(i.toString(), JSON.stringify(configData[i]));
    periods[i] = JSON.parse(localStorage.getItem(i.toString()));
  }
  request();
  timelineModule.putTimelinePin(Day, periods, daySkipped);
});

// ******************************************************************************************* Accessible to other apps
var exports = this.exports = {};

exports.showMainWindow = function () {
  // Adds the background rectangles
  mainWind.add(backTop);
  mainWind.add(backBottom);

  // Adds the first card and pushes window
  createElements(0, cardIndex);
  mainWind.show();
  
  // Contact server to get most current calendar, then
  // Make the request to see what day it is
  fetchURL();
};

exports.hideMainWindow = function() {
  mainWind.hide();
};
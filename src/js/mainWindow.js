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
var usernames = [];
// Assigns users to the username array
for (var i = 0; i < parseInt(users); i++) {
  usernames[i] = (localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
  console.log(localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
}
// Gets periods from storage
var periods = [];
for (i = 0; i <= (users * 8 + 7); i++) {
  periods[i] = JSON.parse(localStorage.getItem(i.toString()));
}
var online = true; // determines whether the user is online or not
var working = true; // determines whether the calendar is on or not
var currentPeriod = 0; // determines what period of the schedule will be shown
var Day = 'day'; // a string that holds what day it is
var dateFetched = localStorage.getItem('dateFetched'); // gets the date the last time the Day was fethed
var timesSkipped = 0; // used to keep track of how many times 'no day' there have been

// Construct URL
var URL = 'https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_783e3p4smqg0s5nn1mtu921340@group.calendar.google.com/events?key=AIzaSyAjadW_dG-vMWLeXhb_8YodtQ9r5Y23Hvc';
var daySkipped = 0; // used to keep track of how many times days have been skipped
var start = moment().startOf('day').format(); // used for construction of URL (start time)
var end = moment().endOf('day').format(); // used for construction of URL (end time)

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
        timesSkipped++; // adds one to the counter of how many times there has been 'no school'
        if (timesSkipped < 9) {
        daySkipped ++; // adds one to the counter of how many times days have been skipped
        start = moment().startOf('day').add(daySkipped, 'days').format(); // changes the start time to one day forward
        end = moment().endOf('day').add(daySkipped, 'days').format(); // change the end time to one day forward
        request(); //requests again
        } else {
          working = false; // it has been 9 or more days since the calendar has a day, therefore it's likely that it is now a vacation day or break
          dayDescription[cardIndex].text('It\'s vacation!'); // sets the text assuming it's a vacation or a break
          dayText[cardIndex].text(':)');
          periodDescription[cardIndex].text('Or sum ting wong.');
          periodText[cardIndex].text(':(');
          Day = 'Day 1'; // sets to Day 1 if nothing is working
          currentPeriod = 0; // sets current period to the first period if nothing is working
        }
      } 
      // Show to user if school day
      else {
        localStorage.setItem('Day', Day); // stores the day in persistent storage
        localStorage.setItem('dateFetched', moment().
                             add(daySkipped, 'days').format('YYYY-MM-DD')); // stores the date that the day is describing
        console.log(moment().add(daySkipped, 'days').format('YYYY-MM-DD'));
        display(daySkipped); // shows the day in the top half
        setPeriod(parseInt(Day.substring(4,5))); // shows the period in the bottom half\
				dateFetched = localStorage.getItem('dateFetched');
				if (localStorage.getItem('timelinePinIsCreated') != dateFetched + 'true') {
					console.log("timeline pins are being created.");
					timelineModule.putTimelineModulePin(Day, periods, daySkipped); // creates and puts timelineModule Pins
				}
			}
    },
    function(error) {
      // Failure!
      if (localStorage.getItem('Day') === null) { // this means that the user does not have a day that was fetched in local storage
        dayDescription[cardIndex].text('You\'re offline!');  // sets text in the main window
        dayText[cardIndex].text(':(');
        periodDescription[cardIndex].text('Check again later!');
        periodText[cardIndex].text(':(');
        console.log('There is no date stored!');
      } else {console.log('Failed fetching schedule data: ' + error);
        console.log('The day is ' + localStorage.getItem('Day')); // shows the day that was last fetched from local storage
        online = false; // the user is offline!
        Day = localStorage.getItem('Day'); // gets the last day from persistent storage
        dateFetched = localStorage.getItem('dateFetched'); // get the date that is attached to the day
        var timeShown = moment(dateFetched).format('ddd Do'); // formats the date like 'Mon 13th'
        if (moment().isAfter(dateFetched, 'day')) { // depending on what the date is compared to today, will display something different.
          dayDescription[cardIndex].text(timeShown + ' was a'); // shows something like 'Mon 13th was a'
          dayText[cardIndex].text(Day); // shows the day
          periodDescription[cardIndex].text('You\'re offline!'); // tells user that they are offline in the bottom half of the window
          periodText[cardIndex].text(':('); // sad face!
        } else if (moment().isSame(dateFetched, 'day')) { // if the date is the same, use the data.
          dayDescription[cardIndex].text(timeShown + ' is a');
          dayText[cardIndex].text(Day.toUpperCase());
          setPeriod(parseInt(Day.substring(4,5)));
        } else { // if the date is in the future, use the date.
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
function display(day) { // looks at how many days have been skipped and creates text accordingly
  switch(day) {
    case 0: // this means that the day is today
      dayDescription[cardIndex].text('It\'s a');
      dayText[cardIndex].text(Day.toUpperCase());
      break;
    case 1: // this means that the day is tomorrow
      dayDescription[cardIndex].text('Tomorrow\'s a');
      dayText[cardIndex].text(Day.toUpperCase());
      break;
    default: // this means that the day is sometime in the future, but isn't tomorrow
      dayDescription[cardIndex].text(moment().add(day, 'days').format("ddd ") + 
                          moment().add(day, 'days').format("Do") + ' will be a');
      dayText[cardIndex].text(Day.toUpperCase());
  }
}

// ******************************************************************************************* Display the period on the card
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
      if (day == 1 || day == 2) { // depending on which day it is, the schedule will show a different block
        currentPeriod = 0;
      } else {
        currentPeriod = 1;
      }
      console.log('Period 1');
      if (current) { // shows that the current period is nothing if the user is on a friend's card
        dayDescription[cardIndex].text('Current period');
        dayText[cardIndex].text('NONE!');
      }
      periodDescription[cardIndex].text('First period'); // shows the next period; in this case, it's the first period
      periodText[cardIndex].text(String(periods[periodSetter.setPeriod(day, cardIndex)[0]].name).toUpperCase());
    }
    // If before start of second period, shows second period (which is the next period)
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
    // If before start of third period, shows third period
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
    // If before start of fourth period, shows fourth period
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
    // Otherwise, assume it's outside of school hours and show that there is no class left.
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

// ******************************************************************************************* Other user UI Elements
// Scrolls to next element
var created = []; // keeps track of whether the elements have been created for this user
mainWind.on('click', 'down', function (animateThingsDown) {
  cardIndex += 1; // adds one to the card number that the user is currently on
  // Create other elements
  if (created[cardIndex] !== true && cardIndex <= users) { // if the card has not previously been created and the user has not reached the last user
    createElements(1, cardIndex); // things are created!
    created[cardIndex] = true; // sets that this card has now been created and no longer needs to be created
    setPeriod(parseInt(Day.substring(4,5)), true); // in the card, show the current period and the next period of a friend
  }
  
  // Animate the elements down
  if (cardIndex <= users) {
    mainWind.each(function (element) {
      if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') { // animates everything down except for background!
        element.animate('position', new Vector2(element.position().x, element.position().y -= Feature.resolution().y), 150);
      }});
  } else {
    cardIndex -= 1; // because the user is not going down, takes out the cardIndex += 1 at the beginning of this function
  }
  console.log('clicked down! to card #' + cardIndex);
});

// Scrolls to previous element
mainWind.on('click', 'up', function (animateThingsUp) {
  if (cardIndex >= 1) {
    mainWind.each(function (element) {
    if (element.backgroundColor() != 'jaeger green' && element.backgroundColor() != 'blue moon') { // same as above
                element.animate('position', new Vector2(element.position().x, element.position().y += Feature.resolution().y), 150);
    }});
    cardIndex -= 1; // tells program that the card that the user is on is one higher up.
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
  if (users !== null && periods[0] !== null) { // if the user has opened the settings page before, add parameters to URL in order to prefill it
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
	configURL += "&wakeup=" + localStorage.getItem('wakeup_enabled');
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
  users = configData[configData.length - 2]; // sets number of users based on the second last element of the array
	var wakeup_enabled = configData[configData.length - 1]; // sets whether to enable the wakeup module based on the last element of the array
	localStorage.setItem('wakeup_enabled', wakeup_enabled);
	console.log('The wakeup is set to ' + wakeup_enabled);
	if (wakeup_enabled) {
		wakeupModule.scheduleWakeup();
		wakeupModule.wakeupEvent();
	} else {
		Wakeup.cancel('all');
	}
  for (var i = 0; i < users; i++) {
    localStorage.setItem(String(8 * (users + 1) + i), configData[8 * (users + 1) + i]); // sets names of users based on number of users
    usernames[i] = localStorage.getItem(String(8 * (users + 1) + i));
		console.log('username: ' + usernames[i]);
  }
  localStorage.setItem('users', users);
	console.log('users: ' + users);
  for (i = 0; i < configData.length - (users + 1); i++) { // sets periods based on number of users
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
	
	// Make the request to see what day it is
	request();
};

exports.hideMainWindow = function() {
	mainWind.hide();
};
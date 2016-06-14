var UI = require('ui');
var ajax = require('ajax');
var moment = require('moment');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var Accel = require('ui/accel');
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

//Creates elements that display the day and/or periods to the user. Mostly self-explanatory.
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

// Construct periods and users' names
var users = localStorage.getItem('users');
// Gets user' names from storage
var usernames = [];
for (var i = 0; i < parseInt(users); i++) {
  usernames[i] = (localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
  console.log(localStorage.getItem(String(8 * (parseInt(users) + 1) + i)));
}
// Gets periods from storage
var periods = [];
for (i = 0; i <= (users * 8 + 7); i++) {
  periods[i] = JSON.parse(localStorage.getItem(i.toString()));
}
var online = true; //determines whether the user is online or not
var working = true; //determines whether the calendar is on or not
var currentPeriod = 4; //determines what period of the schedule will be shown
var Day = 'day'; //a string that holds what day it is
var dateFetched = localStorage.getItem('dateFetched'); //gets the date the last time the Day was fethed
var timesSkipped = 0; //used to keep track of how many times 'no day' there have been

// Construct URL
var URL = 'https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9dul7c0nu4poqkgbhsfu0qe2t0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw';
var daySkipped = 0; //used to keep track of how many times days have been skipped
var start = moment().startOf('day').format(); //used for construction of URL (start time)
var end = moment().endOf('day').format(); //used for construction of URL (end time)

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
        timesSkipped++; //adds one to the counter of how many times there has been 'no school'
        if (timesSkipped < 9) {
        daySkipped ++; //ads one to the counter of how many times days have been skipped
        start = moment().startOf('day').add(daySkipped, 'days').format(); //changes the start time to one day forward
        end = moment().endOf('day').add(daySkipped, 'days').format(); //change the end time to one day forward
        request(); //requests again
        } else {
          working = false; //it has been 9 or more days since the calendar has a day, therefore it's likely that it is now a vacation day or break
          dayDescription[cardIndex].text('It\'s vacation!'); //sets the text assuming it's a vacation or a break
          dayText[cardIndex].text(':)');
          periodDescription[cardIndex].text('Or sum ting wong.');
          periodText[cardIndex].text(':(');
          Day = 'Day 1'; //sets to Day 1 if nothing is working
          currentPeriod = 0; //sets current period to the first period if nothing is working
        }
      } 
      //Show to user if school day
      else {
        localStorage.setItem('Day', Day); //stores the day in persistent storage
        localStorage.setItem('dateFetched', moment().
                             add(daySkipped, 'days').format('YYYY-MM-DD')); //stores the date that the day is describing
        console.log(moment().add(daySkipped, 'days').format('YYYY-MM-DD'));
        display(daySkipped); //shows the day in the top half
        setPeriod(parseInt(Day.substring(4,5))); //shows the period in the bottom half
      }
    },
    function(error) {
      // Failure!
      console.log('Failed fetching schedule data: ' + error);
      online = false; //the user is offline!
      Day = localStorage.getItem('Day'); //gets the last day from persistent storage
      dateFetched = localStorage.getItem('dateFetched'); //get the date that is attached to the day
      var timeShown = moment(dateFetched).format('ddd Do'); //formats the date like 'Mon 13th'
      if (moment().isAfter(dateFetched, 'day')) { //depending on what the date is compared to today, will display something different.
        dayDescription[cardIndex].text(timeShown + ' was a'); //shows something like 'Mon 13th was a'
        dayText[cardIndex].text(Day); //shows the day
        periodDescription[cardIndex].text('You\'re offline!'); //tells user that they are offline in the bottom half of the window
        periodText[cardIndex].text(':('); //sad face!
      } else if (moment().isSame(dateFetched, 'day')) { //if the date is the same, use the data.
        dayDescription[cardIndex].text(timeShown + ' is a');
        dayText[cardIndex].text(Day.toUpperCase());
        setPeriod(parseInt(Day.substring(4,5)));
      } else { //if the date is in the future, use the date.
        dayDescription[cardIndex].text(timeShown + ' will be a');
        dayText[cardIndex].text(Day.toUpperCase());
        setPeriod(parseInt(Day.substring(4,5)));
      }
    }
  );
}

//Displays day to user
function display(day) { //looks at how many days have been skipped and creates text accordingly
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
  //No periods are not set, user is told to set up in app
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

//Shows menu that shows the schedule
function showSchedule() {
  console.log('clicked!');
  console.log(Number(Day.substring(4,5)) + 1);
  var scheduleMenu = new UI.Menu({
    highlightBackgroundColor: Feature.color('blue moon', 'black'),
    sections: [{
      title: titleSetter.setTitle(parseInt(Day.substring(4,5))), //sets the title of the section with module
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)), cardIndex) //sets the items of the section with module
    }, {
      title: titleSetter.setTitle(parseInt(Day.substring(4,5)) + 1),
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)) + 1, cardIndex)
    }]
  });
  scheduleMenu.status(false); //hides the status bar
  scheduleMenu.show();
  var selection = (working) ? currentPeriod:0; //if not a break, selection is currentPeriod; otherwise, default to first period
  scheduleMenu.selection(0, selection);
  scheduleMenu.on('select', function showScheduleDetails(e) {
    //Shows additional details about classes when selected
    console.log('The period is ' + e.item.title.substring(4));
    var backExtraDetail = new UI.Window({
    backgroundColor: Feature.color('jaeger green', 'white'),
    status: false
  });
    createExtraDetailWindow(e, backExtraDetail); //if the user selects a period, then a window pops up with more details
    backExtraDetail.show();
                  });
  scheduleMenu.on('back', function showScheduleDetails(e) { //kills the window when user presses back
    mainWind.show();
    scheduleMenu.hide();
  });
}
  
//App Settings
Pebble.addEventListener('showConfiguration', function() {
  var configURL = 'http://cbschedulemana.ga/index.html';
  if (users !== null && periods[0] !== null) { //if the user has opened the settings page before, add parameters to URL in order to prefill it
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
  users = configData[configData.length - 1]; //sets number of users based on the last element of the array
  for (var i = 0; i < users; i++) {
    localStorage.setItem(String(8 * (users + 1) + i), configData[8 * (users + 1) + i]); //sets names of users based on number of users
    usernames[i] = localStorage.getItem(String(8 * (users + 1) + i));
    console.log(usernames[i]);
  }
  localStorage.setItem('users', users);
  console.log(users);
  for (i = 0; i < configData.length - (users + 1); i++) { //sets periods based on number of users
    localStorage.setItem(i.toString(), JSON.stringify(configData[i]));
    periods[i] = JSON.parse(localStorage.getItem(i.toString()));
  }
  request();
});


//Show schedule viewer when user clicks 'select' on the main window
mainWind.on('click', 'select', showSchedule);

//Scrolls to next element
var created = []; //keeps track of whether the elements have been created for this user
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


//Creates a window with nice details
function createExtraDetailWindow(e, window) {
  
  var classCodeText = new UI.Text({ //textbox for the class code
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                           new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 38),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 + 28)),
    text: e.item.subtitle,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  
  var classText = new UI.Text({ //textbox for the name of the class
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                           new Vector2(Feature.resolution().x * 0.75, 42)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 66),
                                new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 - 56)),
    text: e.item.title.substring(4),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  
  //textbox for the name of the teacher
  var dayNumber = Feature.color(e.section.title.substring(4, 5), e.section.title.substring(12, 13)); //sets what day it is depending on the string in the title
  console.log(dayNumber);
  var classTeacherText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                           new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 80),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 - 70)),
    text: (String(periods[periodSetter.setPeriod(parseInt(dayNumber), cardIndex)[e.itemIndex]].teacher).toUpperCase()),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
   
  //textbox for the name of the classroom
  var classRoomsText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                           new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 55),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 + 45)),
    text: (String(periods[periodSetter.setPeriod(parseInt(dayNumber), cardIndex)[e.itemIndex]].room).toUpperCase()),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
  
  //image icon in the middle of the card
  var centerImage = new UI.Image({
    size: new Vector2(64, 64),
    position: new Vector2(Feature.resolution().x / 2 - 32, Feature.resolution().y / 2 - 32),
    image: imageSetter.setImage(String(e.item.title.substring(4))), //gets path for the image from the module
    compositing: 'set'
  });
  
  //Shows a back chevron if the textbox is small enough to not look bad
  if (e.item.title.substring(4).length < 8 && (String(periods[periodSetter.setPeriod(parseInt(dayNumber), cardIndex)[e.itemIndex]].teacher)).length < 11) {
    var backTriangle = new UI.Text({
    size: new Vector2(42, 42),
    position: Feature.rectangle(new Vector2(12, 0), new Vector2(12, Feature.resolution().x / 2 - 21)),
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

Accel.config();
//A little easter egg
var tapped = 0;
mainWind.on('accelTap', function(e) {
  tapped ++;
  console.log('Tapped the window ' + tapped + ' times!');
  if (tapped == 10) {
    tapped = 0;
    var easterEgg = new UI.Window({
      backgroundColor: 'white',
      status: false
    });
    var devText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                             new Vector2(Feature.resolution().x / 2, 27)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 80),
                                  new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 - 80)),
      text: 'MADE BY:',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
    });
    var devName = new UI.Text({ //textbox for name of developer
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                           new Vector2(Feature.resolution().x * 0.75, 42)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 66),
                                new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 - 66)),
    text: 'AARON TAN',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
    var centerImage = new UI.Image({
      size: new Vector2(64, 64),
      position: new Vector2(Feature.resolution().x / 2 - 32, Feature.resolution().y / 2 - 32),
      image: 'images/cow',
      compositing: 'set'
  });
    var captionText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                             new Vector2(Feature.resolution().x * 0.75, 42)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 40),
                                  new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 - 40)),
      text: 'Here\'s a cow.',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
  });
    var creditsText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                              new Vector2(Feature.resolution().x * 0.75, 42)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 18),
                                  new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 + 13)),
      text: 'Icons from Open Iconic, IconArchive',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
    });
    var copyrightText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                             new Vector2(Feature.resolution().x * 0.75, 42)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 55),
                                  new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 + 50)),
      text: '© 2016, v0.31',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
  });
    easterEgg.add(devText);
    easterEgg.add(devName);
    easterEgg.add(captionText);
    easterEgg.add(centerImage);
    easterEgg.add(creditsText);
    easterEgg.add(copyrightText);
    easterEgg.show();
  }
});
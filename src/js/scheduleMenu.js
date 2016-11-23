var UI = require('ui');
var Feature = require('platform/feature');
var itemSetter = require('itemSetter.js');
var titleSetter = require('titleSetter.js');
var mainWindow = require('mainWindow.js');
var extraDetailWindow = require('extraDetailWindow.js');
var exports = this.exports = {};

// ******************************************************************************************* Show schedule MenuList
// Shows menu that shows the entire schedule
exports.showSchedule = function(Day, cardIndex, working, currentPeriod) {
  console.log('clicked to show schedule!');
  console.log(Number(Day.substring(4,5)) + 1);
  var scheduleMenu = new UI.Menu({ // creates a new menu object to hold the schedule
    highlightBackgroundColor: Feature.color('blue moon', 'black'),
    sections: [{
      title: titleSetter.setTitle(parseInt(Day.substring(4,5))), // sets the title of the section depending on value returned by module
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)), cardIndex) // sets the items of the section depeneding on values returned by module
    }, {
      title: titleSetter.setTitle(parseInt(Day.substring(4,5)) + 1), // sets the title of the second section depending on the value returned by module
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)) + 1, cardIndex) // same as above but for second section
    }]
  });
  scheduleMenu.status(false); //hides the status bar
  scheduleMenu.show(); // shows the menu to the user
  var selection = (working) ? currentPeriod:0; // if not a break, selection is current period; otherwise, default to first period
  scheduleMenu.selection(0, selection); // sets the selected period to the first section and whichever period index was previously chosen
  scheduleMenu.on('select', function showScheduleDetails(e) {
    //Shows additional details about classes when selected
    console.log('The period is ' + e.item.title.substring(4)); // logs the period that the user clicked
    var backExtraDetail = new UI.Window({ // sets the background color of the extra detail window
    backgroundColor: Feature.color('jaeger green', 'white'), // green if Pebble Time, white if not
    status: false // no status bar here!
  });
    extraDetailWindow.createExtraDetailWindow(e, backExtraDetail, cardIndex); // if the user selects a period, then a window pops up with more details
    backExtraDetail.show();
                  });
  scheduleMenu.on('back', function showScheduleDetails(e) { // kills the window when user presses back
    scheduleMenu.hide();
		mainWindow.showMainWindow();
  });
};
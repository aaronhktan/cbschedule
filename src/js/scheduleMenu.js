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
  var scheduleMenu = new UI.Menu({
    highlightBackgroundColor: Feature.color('blue moon', 'black'),
    sections: [{
      title: titleSetter.setTitle(parseInt(Day.substring(4,5))), // Sets the title of the section depending on value returned by module
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)), cardIndex) // Sets the items of the section depeneding on values returned by module
    }, {
      title: titleSetter.setTitle(parseInt(Day.substring(4,5)) + 1), // Sets the title of the second section depending on the value returned by module
      backgroundColor: Feature.color('jaeger green', 'white'),
      items: itemSetter.setItems(parseInt(Day.substring(4,5)) + 1, cardIndex) // Same as above but for second section
    }]
  });
  scheduleMenu.status(false); // Hides the status bar
  scheduleMenu.show(); // Shows the menu to the user
  var selection = (working) ? currentPeriod:0; // If not a break, selection is current period; otherwise, default to first period
  scheduleMenu.selection(0, selection); // Sets the selected period to the first section and whichever period index was previously chosen

  scheduleMenu.on('select', function showScheduleDetails(e) {
    // Shows additional details about classes when selected
    console.log('The period is ' + e.item.title.substring(4));
    var backExtraDetail = new UI.Window({ // Sets the background color of the extra detail window
      backgroundColor: Feature.color('jaeger green', 'white'), // Green if Pebble Time, white if not
      status: false // no status bar here!
    });
    extraDetailWindow.createExtraDetailWindow(e, backExtraDetail, cardIndex); // If the user selects a period, then a window pops up with more details
    backExtraDetail.show();
  });
  
  scheduleMenu.on('back', function showScheduleDetails(e) {
    scheduleMenu.hide();
    mainWindow.showMainWindow();
  });
};
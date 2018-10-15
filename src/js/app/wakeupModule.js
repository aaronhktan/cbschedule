var Wakeup = require('wakeup');
var moment = require('moment');
var mainWindow = require('mainWindow.js');
var exports = this.exports = {};

exports.scheduleWakeup = function() {
  Wakeup.cancel('all'); // Cancels all previous ones and sets a new one just in case
  // Adds one day and sets the time to 12:01 AM, then divides by 1000 because Wakeup requires seconds, not milliseconds
  var scheduleTime = moment().add(1, 'day').hours(0).minute(1).seconds(0) / 1000;
  Wakeup.schedule(
    {
      // Set the wakeup event for tomorrow at 12:01 AM
      time: scheduleTime,
    }, // Did it succeed?
    function(e) {
      if (e.failed) {
        // Log the error reason
        console.log('Wakeup set failed: ' + e.error);
      } else {
        console.log('Wakeup set! Event ID: ' + e.id);
        console.log('Wakeup set! At this time: ' + scheduleTime);
      }
    }
  );
  console.log('The scheduled time is ' + scheduleTime); // For debug purposes
};

exports.wakeupEvent = function () {
  // When woken up at 12:01 AM, starts a timer for 15 seconds and then closes the app.
  Wakeup.on('wakeup', function(e) {
    console.log('Wakeup event! ' + JSON.stringify(e));
    setInterval(function(){ mainWindow.hideMainWindow(); }, 15000);
  });
};
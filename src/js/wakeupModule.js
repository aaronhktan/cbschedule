var Wakeup = require('wakeup');
var moment = require('moment');
var mainWindow = require('mainWindow.js');
var exports = this.exports = {};

exports.scheduleWakeup = function() {
	Wakeup.cancel('all');
// 	var scheduleTime = moment().add(1, 'days').hour(0).minute(0).second(0);
	var scheduleTime = moment().add(1, 'day').hours(0).minute(1).seconds(0) / 1000;
	Wakeup.schedule(
		{
			// Set the wakeup event for tomorrow at 12:00 AM
			time: scheduleTime,
			data: { hello: 'world' }
		},
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
	console.log('The scheduled time is ' + scheduleTime);
};

exports.wakeupEvent = function () {
	// Single wakeup event handler example:
	Wakeup.on('wakeup', function(e) {
		console.log('Wakeup event! ' + JSON.stringify(e));
		setInterval(function(){ mainWindow.hideMainWindow(); }, 15000);
	});
};
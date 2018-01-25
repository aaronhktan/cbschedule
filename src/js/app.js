var Accel = require('ui/accel');
var mainWindow = require('mainWindow.js');
var wakeupModule = require('wakeupModule.js');

// ******************************************************************************************* Main App Logic
Accel.config(); // apparently this is necessary before using the accelerometer
console.log("You are running version 0.7.");
mainWindow.showMainWindow(); // Shows the main window to the user

// For wakeup (checks whether there's a localStorage item with the wakeup key, and whether it's enabled)
if (localStorage.getItem('wakeup_enabled') !== null && localStorage.getItem('wakeup_enabled') == "true") {
	console.log("Wakeup is enabled");
	wakeupModule.scheduleWakeup();
	wakeupModule.wakeupEvent();
} else {
	localStorage.setItem('wakeup_enabled', false);
	console.log("Wakeup is not enabled: " + localStorage.getItem('wakeup_enabled'));
}
var Accel = require('ui/accel');
var mainWindow = require('mainWindow.js');
var wakeupModule = require('wakeupModule.js');

// ******************************************************************************************* Main App Logic
Accel.config(); // apparently this is necessary before using the accelerometer
console.log("The main window hasn't been created yet.");
mainWindow.showMainWindow(); // Shows the main window to the user

// For wakeup
if (localStorage.getItem('wakeup_enabled') !== null && localStorage.getItem('wakeup_enabled')) {
	wakeupModule.scheduleWakeup();
	wakeupModule.wakeupEvent();
} else {
	localStorage.setItem('wakeup_enabled', false);
}
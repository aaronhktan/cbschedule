var Accel = require('ui/accel');
var mainWindow = require('mainWindow.js');

// ******************************************************************************************* Main App Logic
Accel.config(); // apparently this is necessary before using the accelerometer
console.log("The main window hasn't been created yet.");
mainWindow.showMainWindow(); // Shows the main window to the user
var Feature = require('platform/feature');
var exports = this.exports = {};
var string = '';

//Sets the title of the menu object depending on what day it is
exports.setTitle = function (day) {
  switch (day) {
    case 1:
    case 3:
    case 5:
      string = Feature.color('DAY 1 AND 3', ' ------ DAY 1 AND 3 ------');
    break;
    case 2:
    case 4:
      string = Feature.color('DAY 2 AND 4', ' ------ DAY 2 AND 4 ------');
    break;
  }
  return string;
};
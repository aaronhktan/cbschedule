var moment = require('moment');
var exports = this.exports = {};
var skipped = false;

// Gets the Day from JSON
exports.findDay = function (data) {
  if (moment().isAfter(moment().hours(15).minutes(15)) && skipped === false) {
    console.log('skipped');
    skipped = true;
    return 'no school';
  } else if (data.search(/day/i) >= 0) {
      console.log('Day found');
      for (var i=0; i<data.length; i++) {
        console.log(i); // If the 5th digit is not a number then that means that it's not formatted in 'Day n' format where n is an integer; as such, it's likely not the correct one for this program.
        if (isNaN(parseInt(data.substring(data.indexOf('Day', i) +
                                          4, data.indexOf('Day', i) + 5))) === false) {
          console.log(data.substring(data.indexOf('Day', i), data.indexOf('Day', i) + 5));
          return data.substring(data.indexOf('Day', i), data.indexOf('Day', i)+ 5);
        } else {
          if (data.indexOf('Day', i + 1) > 0) {
            i = data.indexOf('Day', i + 1) - 1;
          } else {
            { break; }
          }
        }
      }
      console.log('*gasp* fake day');
      return 'no school';
  } else {
    console.log('no day');
    return 'no school';
  }
};
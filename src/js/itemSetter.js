var exports = this.exports = {};
var items = [];

// This module returns the items for a menu object.
exports.setItems = function (day, user) {
  var periods = [];
  var numberOfPeriods = (user + 1) * 8; // sets the number of periods as number of 8 times the number of users
  for (var i = 0; i < numberOfPeriods; i++) {
    periods[i] = JSON.parse(localStorage.getItem(i.toString()));
  }

  switch (day) {
    case 1:
    case 3:
    case 5:
      items = [{
        title: '1A: ' + String(periods[user * 8].name).toUpperCase(), // the first user's period will be at index 0, the second's at index 8, the third at 16.
        subtitle: String(periods[user * 8].code).toUpperCase()
      }, {
        title: '1B: ' + String(periods[user * 8 + 1].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 1].code).toUpperCase()
      }, {
        title: '1C: ' + String(periods[user * 8 + 2].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 2].code).toUpperCase()
      }, {
        title: '1D: ' + String(periods[user * 8 + 3].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 3].code).toUpperCase()
      }];
    break;
    case 2:
    case 4:
      items = [{
        title: '2A: ' + String(periods[user * 8 + 4].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 4].code).toUpperCase()
      }, {
        title: '2B: ' + String(periods[user * 8 + 5].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 5].code).toUpperCase()
      }, {
        title: '2C: ' + String(periods[user * 8 + 6].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 6].code).toUpperCase()
      }, {
        title: '2D: ' + String(periods[user * 8 + 7].name).toUpperCase(),
        subtitle: String(periods[user * 8 + 7].code).toUpperCase()
      }];
    break;
  }
  return items;
};
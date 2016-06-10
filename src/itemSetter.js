var exports = this.exports = {};
var items = [];

exports.setItems = function (day, user) {
  var periods = [];
  var numberOfPeriods = (user + 1) * 16;
  for (var i = 0; i < numberOfPeriods; i++) {
    periods[i] = localStorage.getItem(i.toString());
  }

  switch (day) {
    case 1:
    case 3:
    case 5:
      items = [{
        title: '1A: ' + periods[user * 16].toUpperCase(),
        subtitle: periods[user * 16 + 1].toUpperCase()
      }, {
        title: '1B: ' + periods[user * 16 + 2].toUpperCase(),
        subtitle: periods[user * 16 + 3].toUpperCase()
      }, {
        title: '1C: ' + periods[user * 16 + 4].toUpperCase(),
        subtitle: periods[user * 16 + 5].toUpperCase()
      }, {
        title: '1D: ' + periods[user * 16 + 6].toUpperCase(),
        subtitle: periods[user * 16 + 7].toUpperCase()
      }];
    break;
    case 2:
    case 4:
      items = [{
        title: '2A: ' + periods[user * 16 + 8].toUpperCase(),
        subtitle: periods[user * 16 + 9].toUpperCase()
      }, {
        title: '2B: ' + periods[user * 16 + 10].toUpperCase(),
        subtitle: periods[user * 16 + 11].toUpperCase()
      }, {
        title: '2C: ' + periods[user * 16 + 12].toUpperCase(),
        subtitle: periods[user * 16 + 13].toUpperCase()
      }, {
        title: '2D: ' + periods[user * 16 + 14].toUpperCase(),
        subtitle: periods[user * 16 + 15].toUpperCase()
      }];
    break;
  }
  return items;
};
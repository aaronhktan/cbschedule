var exports = this.exports = {};
var items = [];

exports.setItems = function (day) {
  var periods = [
  localStorage.getItem('onea'),
  localStorage.getItem('oneb'),
  localStorage.getItem('onec'),
  localStorage.getItem('oned'),
  localStorage.getItem('twoa'),
  localStorage.getItem('twob'),
  localStorage.getItem('twoc'),
  localStorage.getItem('twod'),
  ];
    
  var periodCodes = [
    localStorage.getItem('oneacode'),
    localStorage.getItem('onebcode'),
    localStorage.getItem('oneccode'),
    localStorage.getItem('onedcode'),
    localStorage.getItem('twoacode'),
    localStorage.getItem('twobcode'),
    localStorage.getItem('twoccode'),
    localStorage.getItem('twodcode'),
  ];
  switch (day) {
    case 1:
    case 3:
    case 5:
      items = [{
        title: '1A: ' + periods[0].toUpperCase(),
        subtitle: periodCodes[0].toUpperCase()
      }, {
        title: '1B: ' + periods[1].toUpperCase(),
        subtitle: periodCodes[1].toUpperCase()
      }, {
        title: '1C: ' + periods[2].toUpperCase(),
        subtitle: periodCodes[2].toUpperCase()
      }, {
        title: '1D: ' + periods[3].toUpperCase(),
        subtitle: periodCodes[3].toUpperCase()
      }];
    break;
    case 2:
    case 4:
      items = [{
        title: '2A: ' + periods[4].toUpperCase(),
        subtitle: periodCodes[4].toUpperCase()
      }, {
        title: '2B: ' + periods[5].toUpperCase(),
        subtitle: periodCodes[5].toUpperCase()
      }, {
        title: '2C: ' + periods[6].toUpperCase(),
        subtitle: periodCodes[6].toUpperCase()
      }, {
        title: '2D: ' + periods[7].toUpperCase(),
        subtitle: periodCodes[7].toUpperCase()
      }];
    break;
  }
  return items;
};
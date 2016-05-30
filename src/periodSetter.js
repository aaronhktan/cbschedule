var exports = this.exports = {};
var periodNumbers = [];

exports.setPeriod = function (day) {
  switch (day){
    case 1:
      periodNumbers = [0, 1, 2, 3];
    break;
    case 2:
      periodNumbers = [4, 5, 6, 7];
    break;
    case 3:
      periodNumbers = [1, 0, 3, 2];
    break;
    case 4:
      periodNumbers = [5, 4, 7, 6];
    break;
  }
  return periodNumbers;
};
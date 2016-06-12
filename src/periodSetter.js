var exports = this.exports = {};
var periodNumbers = [];

exports.setPeriod = function (day, user) {
  switch (day){
    case 1:
      periodNumbers = [8 * user, 8 * user + 1, 8 * user + 2, 8 * user + 3];
    break;
    case 2:
      periodNumbers = [8 * user + 4, 8 * user + 5, 8 * user + 6, 8 * user + 7];
    break;
    case 3:
      periodNumbers = [8 * user + 1, 8 * user, 8 * user + 3, 8 * user + 2];
    break;
    case 4:
      periodNumbers = [8 * user + 5, 8 * user + 2, 8 * user + 7, 8 * user + 6];
    break;
  }
  return periodNumbers;
};
var exports = this.exports = {};
var periodNumbers = [];

exports.setPeriod = function (day, user) {
  switch (day){
    case 1:
      periodNumbers = [16 * user, 16 * user + 2, 16 * user + 4, 16 * user + 6];
    break;
    case 2:
      periodNumbers = [16 * user + 8, 16 * user + 10, 16 * user + 12, 16 * user + 14];
    break;
    case 3:
      periodNumbers = [16 * user + 2, 16 * user, 16 * user + 6, 16 * user + 4];
    break;
    case 4:
      periodNumbers = [16 * user + 10, 16 * user + 8, 16 * user + 14, 16 * user + 12];
    break;
  }
  return periodNumbers;
};
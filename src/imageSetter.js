var exports = this.exports = {};

//This module chooses an image based on the string that is entered.
exports.setImage = function(periodName) {
  if (periodName.indexOf('CHEM') >= 0 || periodName.indexOf('SCIENCE') >= 0) {
    return 'images/beaker';
  } else if (periodName.indexOf('HISTORY') >= 0) {
    return 'images/book';
  } else if (periodName.indexOf('LAW') >= 0) {
    return 'images/briefcase';
  } else if (periodName.indexOf('SPACE') >= 0 || periodName.indexOf('EARTH') >= 0) {
    return 'images/star';
  } else if (periodName.indexOf('ART') >= 0) {
    return 'images/brush';
  } else if (periodName.indexOf('BIO') >= 0) {
    return 'images/bug';
  } else if (periodName.indexOf('FILM') >= 0 || periodName.indexOf('VISION') >= 0) {
    return 'images/camera';
  } else if (periodName.indexOf('BUSI') >= 0) {
    return 'images/dollar';
  } else if (periodName.indexOf('FRENCH') >= 0) {
    return 'images/eiffel';
  } else if (periodName.indexOf('GEO') >= 0) {
    return 'images/globe';
  } else if (periodName.indexOf('GYM') >= 0 || periodName.indexOf('OOR ED') >= 0 || periodName.indexOf('DANCE') >= 0) {
    return 'images/heart';
  } else if (periodName.indexOf('TECH') >= 0 || periodName.indexOf('COMPUTER') >= 0  || periodName.indexOf('ICS') >= 0) {
    return 'images/monitor';
  } else if (periodName.indexOf('MUSIC') >= 0) {
    return 'images/note';
  } else if (periodName.indexOf('ENGLISH') >= 0) {
    return 'images/pencil';
  } else if (periodName.indexOf('ANTHRO') >= 0 || periodName.indexOf('PSYCH') >= 0) {
    return 'images/person';
  } else if (periodName.indexOf('MATH') >= 0 || periodName.indexOf('CALC') >= 0 || periodName.indexOf('VEC') >= 0) {
    return 'images/plus';
  } else if (periodName.indexOf('TOK') >= 0 || periodName.indexOf('KNOW') >= 0) {
    return 'images/puzzle';
  } else if (periodName.indexOf('SPANISH') >= 0) {
    return 'images/sombrero';
  } else if (periodName.indexOf('PHYSICS') >= 0) {
    return 'images/undo';
  } else {
    return 'images/calendar';
  } 
};
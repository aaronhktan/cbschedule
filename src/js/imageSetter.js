var exports = this.exports = {};

// This module chooses an image based on the string that is entered. For the subjects, mostly.
exports.setImage = function(periodName) {
  if (periodName.indexOf('SPACE') >= 0 || periodName.indexOf('EARTH') >= 0) {
    return 'images/rocket.png';
  } else if (periodName.indexOf('CHEM') >= 0 || periodName.indexOf('SCIENCE') >= 0) {
    return 'images/beaker.png';
  } else if (periodName.indexOf('HISTORY') >= 0) {
    return 'images/book.png';
  } else if (periodName.indexOf('LAW') >= 0) {
    return 'images/briefcase.png';
  } else if (periodName.indexOf('ART') >= 0) {
    return 'images/brush.png';
  } else if (periodName.indexOf('BIO') >= 0) {
    return 'images/bug.png';
  } else if (periodName.indexOf('FILM') >= 0 || periodName.indexOf('VISION') >= 0) {
    return 'images/camera.png';
  } else if (periodName.indexOf('BUSI') >= 0) {
    return 'images/dollar.png';
  } else if (periodName.indexOf('FRENCH') >= 0) {
    return 'images/eiffel.png';
  } else if (periodName.indexOf('GEO') >= 0) {
    return 'images/globe.png';
  } else if (periodName.indexOf('GYM') >= 0 || periodName.indexOf('OOR ED') >= 0 || periodName.indexOf('DANCE') >= 0) {
    return 'images/heart.png';
  } else if (periodName.indexOf('PHYSICS') >= 0) {
    return 'images/undo.png';
  } else if (periodName.indexOf('TECH') >= 0 || periodName.indexOf('COMPUTER') >= 0  || periodName.indexOf('ICS') >= 0) {
    return 'images/monitor.png';
  } else if (periodName.indexOf('MUSIC') >= 0) {
    return 'images/note.png';
  } else if (periodName.indexOf('ENGLISH') >= 0) {
    return 'images/pencil.png';
  } else if (periodName.indexOf('ANTHRO') >= 0 || periodName.indexOf('PSYCH') >= 0) {
    return 'images/person.png';
  } else if (periodName.indexOf('MATH') >= 0 || periodName.indexOf('CALC') >= 0 || periodName.indexOf('VEC') >= 0) {
    return 'images/plus.png';
  } else if (periodName.indexOf('TOK') >= 0 || periodName.indexOf('KNOW') >= 0) {
    return 'images/puzzle.png';
  } else if (periodName.indexOf('SPANISH') >= 0) {
    return 'images/sombrero.png';
  } else {
    return 'images/calendar.png';
  } 
};
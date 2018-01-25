var UI = require('ui');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var periodSetter = require('periodSetter.js');
var imageSetter = require('imageSetter.js');
var exports = this.exports = {};

// ******************************************************************************************* Window with more detail after clicking select on MenuList
// Creates a window with nice details
exports.createExtraDetailWindow = function(e, window, cardIndex) {
  // Get periods and users' names from local storage on phone
  var users = localStorage.getItem('users');
  var periods = [];
  for (var i = 0; i <= (users * 8 + 7); i++) {
    periods[i] = JSON.parse(localStorage.getItem(i.toString()));
  }
  var classCodeText = new UI.Text({ // Textbox for the class code
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                            new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 38),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 + 28)),
    text: e.item.subtitle,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });

  var classText = new UI.Text({ // Textbox for the name of the class
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                            new Vector2(Feature.resolution().x * 0.75, 42)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 66),
                                new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 - 56)),
    text: e.item.title.substring(4),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });

  // Textbox for the name of the teacher
  var dayNumber = Feature.color(e.section.title.substring(4, 5), e.section.title.substring(12, 13)); // Sets what day it is depending on the string in the title
  console.log(dayNumber);
  var classTeacherText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                            new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 80),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 - 70)),
    text: (String(periods[periodSetter.setPeriod(parseInt(dayNumber), cardIndex)[e.itemIndex]].teacher).toUpperCase()),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });

  // Textbox for the name of the classroom
  var classRoomsText = new UI.Text({
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                            new Vector2(Feature.resolution().x / 2, 27)),
    font: 'gothic-18',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 55),
                                new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 + 45)),
    text: (String(periods[periodSetter.setPeriod(parseInt(dayNumber), cardIndex)[e.itemIndex]].room).toUpperCase()),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });

  // Image icon in the middle of the card
  var centerImage = new UI.Image({
    size: new Vector2(64, 64),
    position: new Vector2(Feature.resolution().x / 2 - 32, Feature.resolution().y / 2 - 32),
    image: imageSetter.setImage(String(e.item.title.substring(4))), // Gets path for the image from the module
    compositing: 'set'
  });

  // Shows a back chevron if the textbox is small enough to not look bad
  if (e.item.title.substring(4).length < 8 && (String(periods[periodSetter.setPeriod(parseInt(dayNumber), cardIndex)[e.itemIndex]].teacher)).length < 11) {
    var backTriangle = new UI.Text({
    size: new Vector2(42, 42),
    position: Feature.rectangle(new Vector2(12, 0), new Vector2(12, Feature.resolution().x / 2 - 21)), // Different positions for different types of screens because the buttons are in different places
    text: '<',
    color: 'black',
    textAlign: 'left'
    });
    window.add(backTriangle);
  }

  // Adds all of the elements that were previously created to the main screen
  window.add(classCodeText);
  window.add(classText);
  window.add(classTeacherText);
  window.add(classRoomsText);
  window.add(centerImage);
};
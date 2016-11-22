var UI = require('ui');
var Vector2 = require('vector2');
var Feature = require('platform/feature');
var exports = this.exports = {};

// ******************************************************************************************* The Easter Egg Window
// A little easter egg for those that decide to see it
var tapped = 0;
exports.createEasterEggWindow = function(e) {
  tapped ++; // adds one to counter of how many times the user has shaken the watch
  console.log('Tapped the window ' + tapped + ' times!');
  if (tapped == 10) { // shows a bunch of credits after 10 taps
    tapped = 0;
    var easterEgg = new UI.Window({
      backgroundColor: 'white',
      status: false
    });
    var devText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 27),
                             new Vector2(Feature.resolution().x / 2, 27)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 80),
                                  new Vector2(Feature.resolution().x / 4, Feature.resolution().y / 2 - 80)),
      text: 'MADE BY:',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
    });
    var devName = new UI.Text({ //textbox for name of developer
    size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                           new Vector2(Feature.resolution().x * 0.75, 42)),
    font: 'gothic-28-bold',
    position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 66),
                                new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 - 66)),
    text: 'AARON TAN',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'black'
  });
    var centerImage = new UI.Image({
      size: new Vector2(64, 64),
      position: new Vector2(Feature.resolution().x / 2 - 32, Feature.resolution().y / 2 - 32),
      image: 'images/cow',
      compositing: 'set'
  });
    var captionText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                             new Vector2(Feature.resolution().x * 0.75, 42)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 - 40),
                                  new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 - 40)),
      text: 'Here\'s a cow.',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
  });
    var creditsText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                              new Vector2(Feature.resolution().x * 0.75, 42)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 18),
                                  new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 + 13)),
      text: 'Icons from Open Iconic, IconArchive',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
    });
    var copyrightText = new UI.Text({
      size: Feature.rectangle(new Vector2(Feature.resolution().x - 24, 42),
                             new Vector2(Feature.resolution().x * 0.75, 42)),
      font: 'gothic-18',
      position: Feature.rectangle(new Vector2(12, Feature.resolution().y / 2 + 55),
                                  new Vector2(Feature.resolution().x * 0.125, Feature.resolution().y / 2 + 50)),
      text: '© 2016, v0.50',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      color: 'black'
  });
    easterEgg.add(devText);
    easterEgg.add(devName);
    easterEgg.add(captionText);
    easterEgg.add(centerImage);
    easterEgg.add(creditsText);
    easterEgg.add(copyrightText);
    easterEgg.show();
  }
};
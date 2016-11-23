var moment = require('moment');
var timelineJS = require('timelineJS.js');
var periodSetter = require('periodSetter.js');
var exports = this.exports = {};

// Creates timeline pin
function createTimelinePin(periodName, periodTime, periodLocation, Day, id) {
	 var pin = {
    'id': id,
    'time': periodTime,
		'duration': 75,
    'layout': {
      'type': "calendarPin",
      'backgroundColor': "#00AA55", //jaeger green
      'title': periodName,
			'locationName': periodLocation,
			'body': 'It\'s a ' + Day + '.\n\n-\nPushed by CB Schedule on ' + moment().format("dddd, MMMM Do YYYY, h:mm a") + '. Have a nice day!',
      // Notification icon
      'tinyIcon': "system://images/SCHEDULED_EVENT",
		},
		'actions': [{
      'title': 'View Full Schedule',
      'type': "openWatchApp"
    }]
	 };
	
	timelineJS.insertUserPin(pin, function(responseText) {
  console.log('Result: ' + responseText);
	});
}

// Puts timeline pin
exports.putTimelinePin = function(Day, periods, daySkipped) {
	var dateFetched = localStorage.getItem('dateFetched');
	for (var i = 0; i <= 4; i++) {
		switch(i) {
			case 0:
				createTimelinePin((String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[0]].name).toUpperCase()), moment().add(daySkipped, 'days').set({'hour': 09, 'minute': 15}).format(), 
													(String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[0]].room).toUpperCase()), Day,
													'cb-schedule-itm' + dateFetched + '0915');
				console.log('created pin #1: ' + 'cb-schedule-itm' + dateFetched + '0915');
				break;
			case 1:
				createTimelinePin((String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[1]].name).toUpperCase()), moment().add(daySkipped, 'days').set({'hour': 10, 'minute': 35}).format(), 
													(String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[1]].room).toUpperCase()), Day,
													'cb-schedule-itm' + dateFetched + '1035');
				console.log('created pin #2' + 'cb-schedule-itm' + dateFetched + '1035');
				break;
			case 2:
				createTimelinePin((String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[2]].name).toUpperCase()), moment().add(daySkipped, 'days').set({'hour': 12, 'minute': 40}).format(), 
													(String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[2]].room).toUpperCase()), Day,
													'cb-schedule-itm' + dateFetched + '1240');
				console.log('created pin #3' + 'cb-schedule-itm' + dateFetched + '1240');
				break;
			case 3:
				createTimelinePin((String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[3]].name).toUpperCase()), moment().add(daySkipped, 'days').set({'hour': 14, 'minute': 0}).format(), 
													(String(periods[periodSetter.setPeriod(parseInt(Day.substring(4,5)), 0)[3]].room).toUpperCase()), Day,
													'cb-schedule-itm' + dateFetched + '1400');
				console.log('created pin #4' + 'cb-schedule-itm' + dateFetched + '1400');
				break;
		}
	}
	console.log(dateFetched + 'true');
	localStorage.setItem('timelinePinIsCreated', dateFetched + 'true'); // tells app not to set timeline pin again today
};
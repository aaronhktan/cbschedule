// Get a handle to the button's HTML element
var submitButton = document.getElementById('submit_button');

// Add a 'click' listener
submitButton.addEventListener('click', function() {
	
	// Get the config data from the UI elements
	var classes = document.getElementsByClassName('class');
	var codes = document.getElementsByClassName('code');
	var names = document.getElementsByClassName('name');
	var teachers = document.getElementsByClassName('teacher');
	var rooms = document.getElementsByClassName('room');
	var usernames = document.getElementsByClassName('username');
	var wakeup = document.getElementById("wakeupCheck").checked;
	var options = [];
	for (i = 0; i < classes.length; i++) {
		var period = new createPeriod(classes[i].value, codes[i].value, teachers[i].value, rooms[i].value);
		options[i] = period;
	}
	for (i = 0; i < counter; i++) {
		options[(counter + 1) * 8 + i] = usernames[i].value;
	}
	options[(counter + 1) * 8 + counter] = counter;
	options[(counter + 1) * 8 + counter + 1] = wakeup;

	// Determine the correct return URL (emulator vs real watch)
	function getQueryParam(variable, defaultValue) {
	  var query = location.search.substring(1);
	  var vars = query.split('&');
	  for (var i = 0; i < vars.length; i++) {
	    var pair = vars[i].split('=');
	    if (pair[0] === variable) {
	      return decodeURIComponent(pair[1]);
	    }
	  }
	  return defaultValue || false;
	}
	var return_to = getQueryParam('return_to', 'pebblejs://close#');

	// Encode and send the data when the page closes
	document.location = return_to + encodeURIComponent(JSON.stringify(options));
})


function removeSpaces(string) {
	s = string;
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s
}



var counter = 0;
var users = 0;

function clickThings() {
	url = window.location.search.substring(1); 			//Searches the URL for the element number
	if (url.search("users") != -1) { 					//If the URL has the string "numbers"
		params = url.split("&"); 						//Creates an array with each element being separated by "&"
		for (x = 0; x < params.length; x++) { 			//Checks each element
			param = params[x].split("="); 				//Splits up each parameter in URL by "="
		        if (param[0] == "users") { 				//If the first part of the paramater is equal to "users"
		        	users = parseInt(param[1]);			//The number of users is set to the second part of the parameter.
		        }
		}
	}
	else {
		users = 0;
	}
	for (i=1; i<=users; i++) {
		addInput("inputs0");
	}

	var names = document.getElementsByClassName('username');
	for (i = 0; i < names.length; i++) { 													//Cycles through elements in that array
		url = window.location.search.substring(1); 											//Searches the URL for the element number
		if (url.search('user' + i.toString()) != -1) { 															//If the URL has a number
			params = url.split("&"); 														//Creates an array with each element being separated by "&"
			for (x = 0; x < params.length; x++) { 											//Checks each element
				param = params[x].split("="); 												//Splits up each parameter in URL by "="
			        if (param[0] == ('user' + i.toString())) { 											//If the first part of the paramater is equal to the element number
			        	names[i].value = decodeURIComponent(param[1]);						//The element's value is set to the second part of the parameter.
			        }
			}
		}
		else {
			names[i].value = "";
		}
	}

	var wakeup;
	if (url.search("wakeup") != -1) { 				//If the URL has the string "wakeup"
		params = url.split("&"); 						//Creates an array with each element being separated by "&"
		for (x = 0; x < params.length; x++) { 			//Checks each element
			param = params[x].split("="); 				//Splits up each parameter in URL by "="
		        if (param[0] == "wakeup") { 			//If the first part of the paramater is equal to "wakeup"
		        	wakeup = (param[1] == "true");	//Whether wakeup is enabled shows up here
		        }
		}
	} else {
		wakeup = true;
	}

	if (wakeup == true) {
		document.getElementById('wakeupCheck').checked = true;
	}

	var inputs = document.getElementsByTagName('input'); // Gets all elements on page with tag name input
	var classes = document.getElementsByClassName('class'); // Get all elements named class, code, teacher and room
    var codes = document.getElementsByClassName('code');
    var teachers = document.getElementsByClassName('teacher');
    var rooms = document.getElementsByClassName('room');
	var notUserNames = []; // An empty array that will be filled with the elements on the webpage that are not username fields
	for (i = 0; i < inputs.length - 4; i += 4) { // Adds elements of the webpage to the notUserNames array, and assigns each element a number (-4 because there are two username fields, 1 checkbox, and 1 generate/load field)
		notUserNames[i] = classes[i / 4];
		notUserNames[i + 1] = codes[i / 4];
		notUserNames[i + 2] = teachers[i / 4];
		notUserNames[i + 3] = rooms[i / 4];
	}
	for (i = 0; i < notUserNames.length; i++) { 													//Cycles through the textbox elements on the webpage
		url = window.location.search.substring(1); 											//Searches the URL for the element number
		if (url.search(i) != -1) { 															//If the URL has a number
			params = url.split("&"); 														//Creates an array with each element being separated by "&"
			for (x = 0; x < params.length; x++) { 											//Checks each element
				param = params[x].split("="); 												//Splits up each parameter in URL by "="
			        if (param[0] == parseInt(i)) { 											//If the first part of the paramater is equal to the element number
			        	notUserNames[i].value = decodeURIComponent(param[1]);						//The element's value is set to the second part of the parameter.
			        }
			}
		}
		else {
			notUserNames[i].value = "";
		}
	}
	}

var titleDiv = [];
var formDiv = [];

function addInput(divName) {
	counter ++;

	//Create div for title
	titleDiv[counter] = document.createElement('div');
	titleDiv[counter].setAttribute('class', 'subheading');
	titleDiv[counter].setAttribute('id', 'title' + counter);
	titleDiv[counter].innerHTML = '<div class="item-container"><div class="item-container-header">Friend #' + counter + '</div> <div class="item-container-content"> <label class="item"> <div class="item-input-wrapper"> <input class="username item-input" type="text" placeholder="Name" onblur="this.value=removeSpaces(this.value)"/> </div> </div>';

	//Create div for text input
	formDiv[counter] = document.createElement('div');
	formDiv[counter].setAttribute('class', 'form');
	formDiv[counter].setAttribute('id', 'form' + counter);
	formDiv[counter].innerHTML = '<div class="item-container"> <div class="item-container-header">Friend #' + counter + '\'s schedule</div> <div class="form"> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 1A</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 1B</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 1C</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 1D</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 2A</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 2B</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 2C</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> <div class="item-container-content"> <label class="item"> <h5 class="subtitle">Period 2D</h5> <div class="item-input-wrapper"> <input class="class item-input" type="text" placeholder="Class" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="code item-input" type="text" placeholder="Course Code" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="teacher item-input" type="text" placeholder="Teacher" onblur="this.value=removeSpaces(this.value)"/> </div> <div class="item-input-wrapper"> <input class="room item-input" type="text" placeholder="Room" onblur="this.value=removeSpaces(this.value)"/> </div> </label> </div> </div> </div>';


	document.getElementById(divName).appendChild(titleDiv[counter]);
	document.getElementById(divName).appendChild(formDiv[counter]);
	if (counter >= 2) {
		document.getElementById("add_button").disabled = true;
	}
	if (counter >= 1) {
		document.getElementById("remove_button").disabled = false;
	}
}

function removeInput() {
	var title = document.getElementById("title" + counter);
	title.parentNode.removeChild(title);
	var form = document.getElementById("form" + counter);
	form.parentNode.removeChild(form);
	counter --;
	if (counter === 0) {
		document.getElementById("remove_button").disabled = true;
	}
	if (counter <= 1) {
		document.getElementById("add_button").disabled = false;
	}
}

function createPeriod(name, code, teacher, room) {
	this.name = name;
	this.code = code;
	this.teacher = teacher;
	this.room = room;
}

function generateCodes() {
	// Get the config data from the UI elements
	var classes = document.getElementsByClassName('class');
	var codes = document.getElementsByClassName('code');
	var names = document.getElementsByClassName('name');
	var teachers = document.getElementsByClassName('teacher');
	var rooms = document.getElementsByClassName('room');
	var usernames = document.getElementsByClassName('username');
	var wakeup = document.getElementById('wakeupCheck').checked;
	var options = [];
	var users = false;
	var URL = "";
	if (counter > 0) {
		URL += 'users=' + counter;
	}
	for (i = 0; i < counter; i++) {
		users = true;
		URL += "&user" + i + "=" + usernames[i].value;
	}
	for (i = 0; i < (classes.length * 4 - 1); i += 4) {
		URL += "&" + i + "=" + encodeURIComponent(classes[i / 4].value) + "&" + (i + 1) + "=" + encodeURIComponent(codes[i / 4].value) + "&" + (i + 2) + "=" + encodeURIComponent(teachers[i / 4].value) + "&" + (i + 3) + "=" + encodeURIComponent(rooms[i / 4].value);
	}
	URL += '&wakeup=' + wakeup; 
	document.getElementsByClassName('saveCode')[0].value = URL;
}

function loadURL() {
	window.location = 'http://cbschedulemana.ga/index.html?' + document.getElementsByClassName('saveCode')[0].value;
}
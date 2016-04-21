<script>
  // Get a handle to the button's HTML element
  var submitButton = document.getElementById('submit_button');

  // Add a 'click' listener
  submitButton.addEventListener('click', function() {
    // Get the config data from the UI elements
    var onea = document.getElementById('period-1a-input');
    var oneb = document.getElementById('period-1b-input');
    var onec = document.getElementById('period-1c-input');
    var oned = document.getElementById('period-1d-input');
    var twoa = document.getElementById('period-2a-input');
    var twob = document.getElementById('period-2b-input');
    var twoc = document.getElementById('period-2c-input');
    var twod = document.getElementById('period-2d-input');

    // Make a data object to be sent, coercing value types to integers
    var options = {
      'onea': onea,
      'oneb': oneb,
      'onec': onec,
      'oned': oned,
      'twoa': twoa,
      'twob': twob,
      'twoc': twoc,
      'twod': twod
    };

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
  });
</script>

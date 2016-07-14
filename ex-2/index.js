var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var horoscope = require('horoscope');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var step = 0;
  var date = '';

  socket.on('msg', function(msg){
    if (step == 0) {
    	io.emit('msg', "Hi there! What's your birthday? (MM/DD/YYYY)");
    	step++;
    } else if (step == 1) {
    	var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
	    if (date_regex.test(msg)) {
	    	date = msg;
	    	io.emit('msg', 'Would you like to know your horoscope? [y/n]');
	    	step++;
	    } else {
	    	io.emit('msg', 'Please enter a valid date (e.g. MM/DD/YYYY)');
	    }
    } else {
    	if (msg == 'y' || msg == 'yes') {
			dates = date.split('/');
			birthMonth = parseInt(dates[0]);
			birthDay = parseInt(dates[1]);
			birthYear = parseInt(dates[2]);
			var astro = horoscope.getSign(birthMonth, birthDay);
			var zodiac = horoscope.getZodiac(birthYear);
    		var response = "You're astrological sign is " + astro + "! You're zodiac sign is " + zodiac + '.';
    		io.emit('msg', response);
    		step = 0;
    	} else {
    		io.emit("msg", "Well then! Goodbye!");
    		step = 0;
    	}
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

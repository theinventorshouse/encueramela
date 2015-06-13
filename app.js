var Cylon = require('cylon');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var WEBPORT = 3000; // Puerto en el que escucha el servidor web

// getRootCallback: Envia el archivo index.html al usuario
// params:
// 		req: request object
// 		res: response object
function getRootCallback(req, res){
	res.sendfile('index.html');
}

// GET /: Crea la ruta '/' y lanza un callback
app.get('/', getRootCallback);

// Event onConnection: Crea el eventListener y nos indica cuando un
// usuario se conecta o desconecta
io.on('connection', function onConnection(socket) {
	console.log('Se a conectado un usuario :)');

	// Event onDisconnect
	socket.on('disconnect', function onDisconnect() {
		console.log('El usuario se desconecto :(');
	});
});

// Crea el servidor y define el puerto en el que escucha
http.listen(WEBPORT, function serverStart() {
	console.log(WEBPORT);
});

Cylon.robot({
  connections: {
    neurosky: { adaptor: 'neurosky', port: '/dev/ttyS0' }
  },

  devices: {
    headset: { driver: 'neurosky' }
  },

  work: function work(my) {
    my.headset.on('attention', function(data) {
      var level;
      if (data > 50) {
        level = -1;
      }else{
        level = 1;
      }
      io.emit('sensor', level);
      console.log("level" + level);
    });

    // my.headset.on('meditation', function(data) {
    //   console.log("meditation:" + data);
    // });
  }
}).start();

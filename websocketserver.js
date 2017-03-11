var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){
    client.on('event', function(data){});
    client.on('disconnect', function(){});
});
server.listen(3000);
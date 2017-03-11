/**
 * Created by alex on 11/03/17.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

io.on('connection', function (socket) {
    fs.readFile(__dirname + '../tmp/relax.jpg', function(err, buf){
        // it's possible to embed binary data
        // within arbitrarily-complex objects
        socket.emit('data',  { image: true, buffer: buf.toString('base64')});
    });
});

http.listen(3000, function(){
    console.log('Listening on *:3000')
});
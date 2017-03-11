/**
 * Created by alex on 11/03/17.
 */
var sumo = require('node-sumo-client');
var cv = require('opencv');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var w = new cv.NamedWindow("Video", 0);


drone.connect(function() {
    stream = drone.getVideoStream();
    drone.videoStreaming();
});

video.on("data", function (data) {
    buf = data;
});

io.on('connection', function (socket) {
    fs.readFile(__dirname + '/tmp/image.jpeg', function(err, buf){
        // it's possible to embed binary data
        // within arbitrarily-complex objects
        socket.emit('data',  { image: true, buffer: buf.toString('base64') });
    });
});

setInterval(function () {
    if (buf == null) {
        return;
    }

    try {
        cv.readImage(buf, function (err, im) {
            if (err) {
                console.log(err);
            } else {
                if (im.width() < 1 || im.height() < 1) {
                    console.log("no width or height");
                    return;
                }
                w.show(im);
                console.log(__dirname)
                im.save(__dirname +"/tmp/image.png");
                console.log("save Image");
                w.blockingWaitKey(0, 50);
            }
        });
    } catch (e) {
        console.log(e);
    }
}, 100);

http.listen(3000, function(){
    console.log('Listening on *:3000')
});
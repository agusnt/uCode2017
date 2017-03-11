/**
 * Created by alex on 11/03/17.
 */
var sumo = require('node-sumo-client');
var cv = require('opencv');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
    console.log(buf);
    socket.broadcast.emit(buf);
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
                w.blockingWaitKey(0, 50);
            }
        });
    } catch (e) {
        console.log(e);
    }
}, 100);
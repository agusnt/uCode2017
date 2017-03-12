/*
 * Script de Control del Parrot Minidrone Jett
 */

var Cylon = require("cylon");
var sumo = require('node-sumo-client');
var cv = require('opencv');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var xbox = require('xbox-controller-node');

var LEFT_TRESHOLD = 0.25,
    RIGHT_TRESHOLD = -0.25,
    UP_TRESHOLD = -0.25,
    BACK_TRESHOLD = 0.255;

var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var w = new cv.NamedWindow("Video", 0);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

drone.connect(function() {
    stream = drone.getVideoStream();
    drone.videoStreaming();
    console.log("Drone OK");
    drone.on("battery", function(data){
        console.log(data);
    });
});

video.on("data", function (data) {
    buf = data;
});

Cylon.robot({
    connections: {
        leapmotion: { adaptor: 'leapmotion' }
    },

    devices: {
        leapmotion: { driver: 'leapmotion' }
    },

    work: function(my) {
        my.leapmotion.on("gesture", function(gesture) {
            var type = gesture.type;
            // emergency stop
            if (type === "keyTap") {
                drone.animationsSpin();
                console.log("Spin");
            }
        });
        my.leapmotion.on('hand', function(payload) {
            var handOpen = !!payload.fingers.filter(function(f) {
                return f.extended;
            }).length
            if (payload.direction[1] < UP_TRESHOLD)
            {
                drone.forward((payload.direction[1] * -100));
                console.log("Up");
            } else if (payload.direction[1] > BACK_TRESHOLD)
            {
                drone.backward((payload.direction[1] * 100));
                console.log("Back");
            } else
            {
                drone.stop();
                console.log("Stop");
            }

            if (payload.palmNormal[0] > LEFT_TRESHOLD)
            {
                drone.left((payload.palmNormal[0] * 100));
                console.log("Left");
            } else if (payload.palmNormal[0] < RIGHT_TRESHOLD)
            {
                drone.right((payload.palmNormal[0] * -100));
                console.log("Right");
            }
            if (payload.palmPosition[1] > 300)
            {
                drone.animationsLongJump();
                console.log("Jump");
            // } else if (payload.palmPosition[1] < 130)
            // {
            //     drone.animationsSlowShake();
            //     console.log("SlowShake");
            }
            //console.log(payload.toString());
        });
        xbox.on('a', function () {

            console.log('[A] button press');
        });

        xbox.on('b', function () {
            drone.postureJumper(function(){
                drone.animationsHighJump();
            });
            console.log('[B] button press');
        });

        xbox.on('y', function () {
            drone.animationsSpin();
            console.log('[Y] button press');
        });

        xbox.on('x', function () {
            drone.animationsLongJump();
            console.log('[X] button press');
        });
        xbox.on('start', function () {
            drone.animationsStop();
            console.log('[Start] button press');
        });
        xbox.on('leftstickLeft', function () {
            drone.left(100);
            console.log('Moving [LEFTSTICK] LEFT');
        });

        xbox.on('leftstickRight', function () {
            drone.right(100);
            console.log('Moving [LEFTSTICK] RIGHT');
        });

        xbox.on('leftstickDown', function () {
            drone.backward(100);
            console.log('Moving [LEFTSTICK] DOWN');
        });

        xbox.on('leftstickUp', function () {
            drone.forward(100);
            console.log('Moving [LEFTSTICK] UP');
        });
    }
}).start();

io.on('connection', function (socket) {
    console.log("Conexion");
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
                    im.save(__dirname +"/tmp/image.jpeg");
                    fs.readFile(__dirname + '/tmp/image.jpeg', function(err, buf){
                        // it's possible to embed binary data
                        // within arbitrarily-complex objects
                        socket.emit('data',  { image: true, buffer: buf.toString('base64') });
                    });
                    w.blockingWaitKey(0, 50);
                }
            });
        } catch (e) {
            console.log(e);
        }
    }, 100);
});

http.listen(3000, function(){
    console.log('Listening on *:3000')
});
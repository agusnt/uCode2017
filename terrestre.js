var Cylon = require("cylon");
var sumo = require('node-sumo-client');
var cv = require('opencv');

var LEFT_TRESHOLD = 0.25,
    RIGHT_TRESHOLD = -0.25,
    UP_TRESHOLD = -0.25,
    BACK_TRESHOLD = 0.255;

var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;
var w = new cv.NamedWindow("Video", 0);


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
        } else if (payload.palmPosition[1] < 130)
        {
            drone.animationsSlowShake()
            console.log("SlowShake");
        }
        //console.log(payload.toString());
    });
  }
}).start();

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

var Cylon = require("cylon");
var sumo = require('node-sumo-client');

var LEFT_TRESHOLD = 0.25,
    RIGHT_TRESHOLD = -0.25,
    UP_TRESHOLD = -0.25,
    BACK_TRESHOLD = 0.255;

var drone = sumo.createClient();

drone.connect(function()
{
    console.log("Drone OK");
    // drone.on("battery", function(data){
    //     console.log(data);
    // });
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
        if (type === "keyTap" || type === "screenTap") {
            drone.animationsLongJump();
            console.log("Jump");
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
        //console.log(payload.toString());
    });
  }
}).start();

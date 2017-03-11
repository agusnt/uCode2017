const Drone = require('parrot-minidrone');
const Cylon = require("cylon");

const LEFT_TRESHOLD = 0.3,
    RIGHT_TRESHOLD = -0.3,
    UP_TRESHOLD = -0.3,
    BACK_TRESHOLD = 0.3;


const drone = new Drone({
    autoconnect: true,
});
 
drone.on('connected', () => console.log("Let's Go"));

var flightParams = {};

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
            console.log("KeyTap");
            drone.takeoffOrLand();
        }
        if (type === "circle"){
            if(gesture.normal[2] < 0){
                drone.animate('flipLeft');
            }
            if(gesture.normal[2] > 0){
                drone.animate('flipRight');
            }
        }
    });
    my.leapmotion.on('hand', function(payload) {
        // FORWARD/BACK
        if (payload.direction[1] < UP_TRESHOLD)
        {
            flightParams.pitch = 50;
            flightParams.roll = 0;
            flightParams.altitude = 0;
            console.log("Forward");
        } else if (payload.direction[1] > BACK_TRESHOLD)
        {
            flightParams.pitch = -50;
            flightParams.roll = 0;
            flightParams.altitude = 0;
            console.log("Back");
        } else if (payload.palmNormal[0] > LEFT_TRESHOLD)
        {
            flightParams.pitch = 0;
            flightParams.roll = -50;
            flightParams.altitude = 0;
            console.log("Left");
        } else if (payload.palmNormal[0] < RIGHT_TRESHOLD)
        {
            flightParams.pitch = 0;
            flightParams.roll = 50;
            flightParams.altitude = 0;
            console.log("Right");
        } else
        {
            flightParams.pitch = 0;
            flightParams.roll = 0;
            flightParams.altitude = 0;
        }
        //console.log(payload.palmPosition[1])
        // UP/DOWN
        if (payload.palmPosition[1] > 300)
        {
            flightParams.pitch = 0;
            flightParams.roll = 0;
            flightParams.altitude = 50;
            console.log("Up");
        } else if (payload.palmPosition[1] < 130)
        {
            flightParams.pitch = 0;
            flightParams.roll = 0;
            flightParams.altitude = -50;
            console.log("Down");
        } else
        {
            flightParams.altitude = 0;
        }
        drone.setFlightParams(flightParams);
        //console.log(payload.toString());
    });
  }
}).start();

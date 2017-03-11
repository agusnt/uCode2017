const Drone = require('parrot-minidrone');
const Cylon = require("cylon");
const xbox = require("xbox-controller-node");

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
            } else if(gesture.normal[2] > 0){
                drone.animate('flipRight');
            }
        }
        if (type == "screenTap")
            drone.animate('flipBack')
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
      /* Button events */

      xbox.on('a', function () {
          console.log('[A] button press');
          drone.takeoffOrLand();
      });

      xbox.on('b', function () {
          console.log('[B] button press');
          drone.takeoffOrLand();
      });

      xbox.on('y', function () {
          console.log('[Y] button press');
          drone.takeoffOrLand();
      });

      xbox.on('x', function () {
          console.log('[X] button press');
          drone.takeoffOrLand();
      });

      xbox.on('rb', function () {
          console.log('[RB] button press');
          drone.animate('flipRight');
      });

      xbox.on('lb', function () {
          console.log('[LB] button press');
          drone.animate('flipLeft');
      });

      xbox.on('start', function () {
          console.log('[Start] button press');
      });
      //This event is only avaliable on linux
      xbox.on('xboxButton', function () {
          console.log('[Xbox] button press');
      });

      xbox.on('back', function () {
          console.log('[Back] button press');
      });

      xbox.on('leftstickpress', function () {
          console.log('[LEFTSTICK] button press');
      });

      xbox.on('rightstickpress', function () {
          console.log('[RIGHTSTICK] button press');
      });

      /* Stick events */

      xbox.on('leftstickLeft', function () {
          flightParams.pitch = 0;
          flightParams.roll = -50;
          flightParams.altitude = 0;
          flightParams.yaw=0;
          console.log('Moving [LEFTSTICK] LEFT');
      });

      xbox.on('leftstickRight', function () {
          flightParams.pitch = 0;
          flightParams.roll = 50;
          flightParams.altitude = 0;
          flightParams.yaw=0;
          console.log('Moving [LEFTSTICK] RIGHT');
      });

      xbox.on('leftstickDown', function () {
          flightParams.pitch = -50;
          flightParams.roll = 0;
          flightParams.altitude = 0;
          flightParams.yaw=0;
          console.log('Moving [LEFTSTICK] DOWN');
      });

      xbox.on('leftstickUp', function () {
          flightParams.pitch = 50;
          flightParams.roll = 0;
          flightParams.altitude = 0;
          flightParams.yaw=0;
          console.log('Moving [LEFTSTICK] UP');
      });

      xbox.on('rightstickLeft', function () {
          flightParams.pitch = 0;
          flightParams.roll = 0;
          flightParams.altitude = 0;
          flightParams.yaw=50;
          console.log('Moving [RIGHTSTICK] LEFT');
      });

      xbox.on('rightstickRight', function () {
          flightParams.pitch = 0;
          flightParams.roll = 0;
          flightParams.altitude = 0;
          flightParams.yaw=-50;
          console.log('Moving [RIGHTSTICK] RIGHT');
      });

      xbox.on('rightstickDown', function () {
          flightParams.pitch = 0;
          flightParams.roll = 0;
          flightParams.altitude = -50;
          flightParams.yaw=0;
          console.log('Moving [RIGHTSTICK] DOWN');
      });

      xbox.on('rightstickUp', function () {
          flightParams.pitch = 0;
          flightParams.roll = 0;
          flightParams.altitude = 50;
          flightParams.yaw=0;
          console.log('Moving [RIGHTSTICK] UP');
      });


  }
}).start();

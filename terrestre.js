// https://www.npmjs.com/package/node-parrot-drone

var sumo = require('node-sumo-client');

var drone = sumo.createClient();

drone.connect(function() {
    console.log("Conectado");
    drone.forward(500);
    drone.animationsLongJump()

    setTimeout(function() {
        drone.stop();
    }, 1000);

});
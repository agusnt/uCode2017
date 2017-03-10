var sumo = require('node-sumo-client');

var drone = sumo.createClient();

drone.connect(function() {
    drone.postureJumper();
    drone.forward(50);

    setTimeout(function() {
        drone.right(50);
    }, 1000);
});
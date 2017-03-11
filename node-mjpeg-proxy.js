/**
 * Created by alex on 11/03/17.
 */
var MjpegProxy = require('mjpeg-proxy').MjpegProxy;
var express = require('express');
var app = express();

var sumo = require('node-sumo-client');

var drone = sumo.createClient();
var video = drone.getVideoStream();
var buf = null;

drone.connect(function() {
    stream = drone.getVideoStream();
    drone.videoStreaming();
});

video.on("data", function (data) {
    buf = data;
});


app.get('/index1.jpg', new MjpegProxy(buf).proxyRequest);
app.listen(8080);
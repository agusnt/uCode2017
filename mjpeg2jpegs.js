/**
 * Created by alex on 11/03/17.
 */
var mjpeg2jpegs = require("mjpeg2jpegs");
var http = require("http");
http.request({
    hostname: "localhost",
    path: "/videostream.cgi",
}, mjpeg2jpegs(function (res) {
    res.on("imageHeader", function (header) {
        console.log("Image header: ", header);
    });
    res.on("imageData", function (data) {
        console.log("Image data: ", data.length);
    });
    res.on("imageEnd", function () {
        console.log("Image end");
    });
})).end();
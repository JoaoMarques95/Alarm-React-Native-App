//"use strict"

//====LIST DEPENDENCIES===//
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
var mqtt = require("mqtt");
const cors = require("cors");
const mongoose = require("mongoose");
var socketio = require("socket.io");
var http = require("http");
const url = "mongodb://pilldeal:Ojk025df.@ds239157.mlab.com:39157/pilldeal";
const API_PORT = process.env.API_PORT || 3000;

//====MONGOOSE CONNECT===//
/*Mongo Lab credentials
Name:Marques
Pass:Ojk025df.
*/
mongoose.connect(url, function(err, db) {
  if (err) {
    console.log("Unable to connect to the mongoDB server. Error:", err);
  } else {
    console.log("Connection established to", url);
  }
});
//===================================//

//==== CONFIGURATION ===//
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var server = http.Server(app);
var websocket_io = socketio(server);
//===================================//

//==== IMPORTING SHEMAS ===//
const User = require("./models/User.js");
//===================================//

//==== MQTT COnfiguration ===//
var client = mqtt.connect("mqtt://m24.cloudmqtt.com", {
  username: "rgnyorkv",
  password: "8_QL2PQKEC9B",
  port: 10344
});

client.on("connect", function() {
  client.subscribe("Clip1");
  client.subscribe("Msg_Num");
});

//==== MQTT GETTING DATA OF CLICKS ===//
save_clicks = require("./mqtt/save_clicks")(client); //guardar click e validar toma

//==== IMPORTING OUR ROUTES FOLDER ===//
fs.readdirSync(__dirname + "/routes")
  .filter(file => {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach(file => {
    // routes =======It just means that require('./app/routes') returns a function.
    //You can then call this function with another set of parantheses.
    require(`${__dirname}/routes/${file}`)(app, User);
  });
//===================================//

// listen (start app with node server.js) ======================================
server.listen(API_PORT, () => {
  console.log(`Listening on port ${API_PORT}`);
});
//===================================//

// The event will be called when a client is connected.
websocket_io.on("connection", socket => {
  console.log("A client just joined on", socket.id);

  setInterval(function() {
    socket.emit("teste", { message: "Click" });
  }, 1000);
});

/*
To use the web socket, just send the data/message over a named channel.
socket.emit('channel-name', 'Hello world!');

This is identical for both server and client. The other end just has to listen to that named channel.
socket.on('channel-name', (message) => ... some logic );
 */

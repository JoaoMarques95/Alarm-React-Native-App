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
mongoose.connect(
  url,
  { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true },
  function(err, db) {
    if (err) {
      console.log("Unable to connect to the mongoDB server. Error:", err);
    } else {
      console.log("Connection established to", url);
    }
  }
);
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
const User = require("./src/models/User.js");
//===================================//


//============== NOTIFICATION  =====================// 
require("./src/notifications/registerForPushNotificationsAsync.js")(app,User); //ading to database the notification token

require('./src/notifications/post_notification.js')(User,app) //Ading logic from hours and do the post request


//============== Cliend websokets ID =====================// adding to object only
require("./src/sockets/main_socket.js")(websocket_io,User);

//==== MQTT COnfiguration Mqtt ===//
var client = mqtt.connect("mqtt://m24.cloudmqtt.com", {
  username: "rgnyorkv",
  password: "8_QL2PQKEC9B",
  port: 10344
});

client.on("connect", function() {
  //Automaticamente todos os topicos!
  client.subscribe("Clip1");
  client.subscribe("Msg_Num");
});





//==== MQTT FOLDER  ===//
save_clicks = require("./src/mqtt/save_clicks")(client, User); //guardar click / validar e resetar toma.
//===================================//


//==== ROUTES FOLDER ===//
fs.readdirSync(__dirname + "/src/routes")
  .filter(file => {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach(file => {
    require(`${__dirname}/src/routes/${file}`)(app, User);
  });
//===================================//


// listen (start app with node server.js) ======================================
server.listen(API_PORT, () => {
  console.log(`Listening on port ${API_PORT}`);
});
//===================================//
//===================================//
//===================================//













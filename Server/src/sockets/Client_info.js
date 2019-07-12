//SERVER SIDE

var clients = [];

socket.on("storeClientInfo", function(data) {
  //Listening Client info on connect!
  var clientInfo = new Object();
  clientInfo.customId = data.customId;
  clientInfo.clientId = socket.id;
  clients.push(clientInfo);
});

socket.on("disconnect", function(data) {
  //Listening Client info on Disconect!
  for (var i = 0, len = clients.length; i < len; ++i) {
    var c = clients[i];

    if (c.clientId == socket.id) {
      clients.splice(i, 1);
      break;
    }
  }
});

//CLIENT SIDE
socket.on("connect", function(data) {
  // Sending Client info on connect
  socket.emit("storeClientInfo", { customId: "000CustomIdHere0000" });
});

const clients = [];

module.exports = (websocket_io, User) => {
  websocket_io.on('connection', function(socket) {
    socket.on('storeClientInfo', function(data) {
      // Listening Client info on connect!
      const clientInfo = new Object();
      clientInfo.customId = data.customId;
      clientInfo.clientId = socket.id;
      clients.push(clientInfo);
    });

    socket.on('disconnect', function(data) {
      // Listening Client info on Disconect!
      for (let i = 0, len = clients.length; i < len; ++i) {
        if (clients[i].clientId == socket.id) {
          clients_socketId.splice(i, 1);
          break;
        }
      }
    });

    setInterval(function() {
      // require função para emitir a informação a cada cliente (Toma e click (por agora depois tbm a imagem) ){com a informação dos clientes}
    });
  });
};

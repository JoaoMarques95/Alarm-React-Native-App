//==== STARTING ROUTES OF WEBSOCKETS!!!!!! ===//
module.exports = (websocket_io, User) => {
  setInterval(function() {
    User.find(
      {
        username: "teste2"
      },
      (err, users) => {
        //if there is no match it returns an empty array!
        console.log(users[0].Toma);
        var Toma = users[0].Toma;
        socket.emit("teste", { Toma: Toma });
      }
    );
  }, 3000);
};

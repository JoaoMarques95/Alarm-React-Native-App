check28 = comprimidos => {
  if (comprimidos === 28) {
    return true;
  } else {
    return false;
  }
};

check21 = comprimidos => {
  if (comprimidos === 21) {
    return true;
  } else {
    return false;
  }
};

module.exports = (app, User) => {
  app.get("/Update_Initial_Data", (req, res, next) => {
    const { query } = req; //the query now will be the request
    const { username } = query; //Username is the query
    //console.log(username);
    User.find(
      {
        username: username
      },
      (err, user) => {
        //if there is no match it returns an empty array!
        var comprimidos = user[0].Comprimidos;
        var Hora = user[0].Hora_Preferencia;

        if (err) {
          return res.send({
            success: false,
            message: "Error:Server error"
          });
        }
        if (user.length != 1) {
          return res.send({
            success: false,
            message: "Invalid Username"
          });
        }

        return res.send({
          success: true,
          time_show: `Escolhido: ${Hora}`,
          time: Hora,
          check28: check28(comprimidos),
          check21: check21(comprimidos),
          Comprimidos_Show: `Escolhido: ${comprimidos} comprimidos`,
          message: "All Updated!"
        });
      }
    );
  });
};

// User database
module.exports = (app, User) => {
  app.post('/Send_Token_Notifications', (req, res, next) => {
    // listening to a post in this route
    const { body } = req;
    const { token, user } = body;
    const name = user.username;
    const Token = token.value;
    if (!name) {
      return res.send({
        success: false,
        message: 'Error : Name cannot be balnk.',
      });
    }

    if (!Token) {
      return res.send({
        success: false,
        message: 'Error :Token cannot be balnk.',
      });
    }

    User.update({ username: name }, { $set: { token_notificationID: Token } }, (err, info) => {
      if (err) return handleError(err);
      console.log(`Atualização com sucesso!:  ${Token}`);

      return res.send({
        success: true,
        message: 'OK!',
      });
    });
  });
};

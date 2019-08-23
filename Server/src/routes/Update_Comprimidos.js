module.exports = (app, User) => {
  app.post('/Update_Comprimidos', (req, res, next) => {
    const { body } = req;
    const {
      Name, // Name from client
      Comprimidos28,
      Comprimidos21,
    } = body;
    console.log(Name, Comprimidos21, Comprimidos28);
    // Update 28
    if (Comprimidos28) {
      // Do the update
      User.findOneAndUpdate({ username: Name }, { $set: { Comprimidos: 28 } }, (error, doc) => {
        if (error) {
          console.log('Something wrong when updating data!');
          return res.send({
            success: false,
            message: 'Something wrong when updating data!',
          });
        }
        return res.send({
          success: true,
          comprimidos: 'Escolhido: 28 Comprimidos',
          message: 'Update Done, 28 comprimidos!',
        });
      });
    }

    // Update 21
    if (Comprimidos21) {
      // Do the update
      User.findOneAndUpdate({ username: Name }, { $set: { Comprimidos: 21 } }, (error, doc) => {
        if (error) {
          console.log('Something wrong when updating data!');
          return res.send({
            success: false,
            message: 'Something wrong when updating data!',
          });
        }
        return res.send({
          success: true,
          comprimidos: 'Escolhido: 21 comprimidos',
          message: 'Update Done, 21 comprimidos!',
        });
      });
    }

    // Just in case
    if (!Comprimidos21 && !Comprimidos28) {
      return res.send({
        success: false,
        message: 'No data!',
      });
    }
  });
};

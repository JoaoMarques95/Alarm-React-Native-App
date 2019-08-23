module.exports = (app, User) => {
  app.post('/UpdateDataCiclo', (req, res, next) => {
    // passing a post request into this route
    const { body } = req;
    const {
      Name, // Name from client
      CycleState,
    } = body;

    const d = new Date();
    const milli = d.getTime(); // miliseconds from base
    const ActualDate = new Date(milli + 3600000); // more 1h (our date UTC+1)    // Do the update

    // Generate a date of the beguining of that day!

    User.findOneAndUpdate(
      { username: Name },
      { $set: { Data_Inicio: ActualDate /* Data inicio ciclo */ } }, // And lso CycleState
      (error, doc) => {
        if (error) {
          return res.send({
            success: false,
            message: 'Something wrong when updating data!',
          });
        }
        return res.send({
          success: true,
          message: 'Update Done, Time Updated',
        });
      }
    );
  });
};

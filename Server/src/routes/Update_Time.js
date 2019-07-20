Corrigir_hora = Hora => {
  const H_desatualizado = Hora.substring(0, 2);
  const minutos = Hora.substring(3, 5);
  const soma = '01';
  const num = +H_desatualizado + +soma;
  const H_Atualizado = num.toString();

  if (H_desatualizado == '23') {
    return `00:${minutos}`;
  }
  if (!Hora) {
    return '';
  }
  return `${H_Atualizado}:${minutos}`;
};

module.exports = (app, User) => {
  app.post('/Update_Time', (req, res, next) => {
    // passing a post request into this route
    const { body } = req;
    const {
      Name, // Name from client
      Time,
    } = body;

    const Time_Up = Time.substring(11, 16);
    // Do the update
    User.findOneAndUpdate(
      { username: Name },
      { $set: { Hora_Preferencia: Corrigir_hora(Time_Up) } },
      (error, doc) => {
        if (error) {
          return res.send({
            success: false,
            message: 'Something wrong when updating data!',
          });
        }
        return res.send({
          success: true,
          time: `Escolhido: ${Corrigir_hora(Time_Up)}`,
          message: 'Update Done, Time Updated',
        });
      }
    );
  });
};

const { Expo } = require('expo-server-sdk');
const fetch = require('node-fetch');

// iNITIALIZE VARIABLES <===========================>
let sendedHora = false;
let sendedAntesHora = false;

// CALCULATE TIME DIFERENCE <===========================>
function addZero(i) {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
}
function diff_minutes(hora_pref, name) {
  // GET ACTUAL DATE!!
  const d = new Date();
  const milli = d.getTime(); // miliseconds from base
  const ActualDate = new Date(milli + 3600000); // more 1h (our date UTC+1)

  // GET CHOSEN DATE!!
  const y = addZero(d.getFullYear());
  const month = addZero(d.getUTCMonth() + 1);
  const day = addZero(d.getUTCDate());
  const Chosen_Date_string_Desatualizado = `${y}-${month}-${day} ${hora_pref}:00`;
  const Chosen_Date_Desatualizado = new Date(Chosen_Date_string_Desatualizado);
  const Chosen_Date_Atualizado = new Date(Chosen_Date_Desatualizado.getTime() + 3600000);

  // /Calculate THE DIFERENCE!
  const diff = ActualDate - Chosen_Date_Atualizado; // Se possitivo é atraso
  const minutes = diff / 1000 / 60;
  const horas = diff / 1000 / 60 / 60;
  // console.log(`${minutes} MINUTES\n ${horas} HOURS\n  User ${name} delay to his chosen hour --> ${hora_pref}`);
  return [minutes, name, horas];
}

// SEND POST REQUEST TO NOTIFICATION
function send_Push_notification(setings) {
  // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
  // request notification
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'accept-encoding': 'gzip, deflate',
    },
    body: JSON.stringify({
      to: setings.pushToken,
      title: setings.title,
      body: setings.body,
      priority: setings.priority,
      sound: setings.sound,
    }),
  })
    .then(response => response.json()) // conver to json the messsage received
    .then(res => {
      console.log(res);
    });
}

module.exports = (User, app) => {
  User.find({}, (err, users) => {
    if (err) return handleError(err);

    for (const user of users) {
      const pushToken = user.token_notificationID;

      // Setings!
      const setings_test = {
        pushToken,
        title: 'test funcionou!',
        body: 'teste funcionou!',
        priority: 'default',
        sound: 'default',
      };

      // Verification!
      if (!Expo.isExpoPushToken(pushToken)) {
        if (pushToken) {
          console.error(`Push token ${pushToken} is not a valid Expo push token`);
        }
        continue;
      }

      // SENDING!
      const [time, name] = diff_minutes(user.Hora_Preferencia, user.username);

      // Meia hora antes!
      if (time >= -30 && time < 0 && !sendedAntesHora && !user.Toma) {
        sendedAntesHora = true;
        console.log(`ola ${name}, não se esqueça da sua toma em 30 minutos`);
        send_Push_notification(setings);
        // just send notification!!! Done!
      }

      // Na hora!
      if (time >= 0 && time < 1 && !sendedHora && !user.Toma) {
        sendedHora = true;
        console.log(`está na hora da sua toma:${name}`);
        // Aparcer alarme com a opção para adiar
      }
      if (time >= 1 && !user.Toma) {
        console.log(`está atrasado: ${name}`);
        // Aparcer alarme com a opção para adiar até a utilizadora carregar no
      }

      // ADICIONAR TODA A LOGICA RELATIVA A MANDAR AS NOTIFICAÇÕES
      // 30 mins antes
      // na hora
      // x dependendo do tempo de adiar (aperecer pop up)
      // como vou fazer a cena do pop-up aperecer na mesma altura? com soket? referenciar outro ficheiro?7

      // com  send_Push_notification('defeniçoes');
      //= ==================================//
      //= ==================================//
      //= ==================================//
    }
  });
};

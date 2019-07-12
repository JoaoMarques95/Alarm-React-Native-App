function diff_minutes(Last_Click, Actual_Click) {
  //Formato -->''2011-10-09 12:00:02'';
  //Ajustar as strings dos clicks, justar as duas e meter nesse formato!
  var Actual_Click_Date = new Date(Actual_Click); //make the adjustments to make the string
  var Last_Click_Date = new Date(Last_Click); //make the adjustments to make the string
  var diff = Math.abs(Actual_Click_Date - Last_Click_Date); // milliseconds between actual click & Last one!
  var minutes = diff / 1000 / 60;
  console.log(`${minutes} from last click: ${Last_Click}`);
  return minutes;
}




save_clicks_Toma = (client, User) => {
  User.find({}, function(err, users) {
    if (err) return handleError(err);
    users.forEach(element => {
      console.log(element.Topic, 'topics in evaluation');
  //==== Seeing all users ===//
  client.on("message", function(topic, message) {
    //==== Getting Data ===//
    if (topic === element.Topic ) {
      //place to define the topic @@@@@@ir buscar à base de dados
      Data = JSON.parse(message.toString());

      if (Data.State === "Pressed") {
        User.find({ Topic: topic }) //filter the topic
          .select({ Clicks: { $slice: -1 } })
          .exec(function(err, doc) {
            if (err) return handleError(err);

            var Last_click = doc[0].Clicks[0];
            var Actual_click = Data.Time; //aranjar maneira de as strings ficarem no formato indicado!

            if (
              Last_click === undefined ||
              diff_minutes(Last_click, Actual_click) > 60
            ) {
              User.update(
                { Topic: topic }, //query
                { $set: { Toma: true }, $push: { Clicks: Data.Time } }, //Update
                function(err, raw) {
                  if (err) return handleError(err);
                  console.log(
                    ` Atualização com successo \n Topico: ${topic} \n nome:${
                      doc[0].username
                    } \n Data:${Data.Time}`
                  );
                }
              );
            } else {
              console.log("já clicou recentemente");
            }
          });
      }

      if(Data.State === "Reset"){
        User.findOneAndUpdate({ Topic: topic }, { $set: { Toma: true }},(err, raw)=>{
          if (err) return handleError(err);
          console.log('Toma reseted');
        })
      }
    }
  });
})
})
};

module.exports = save_clicks_Toma;






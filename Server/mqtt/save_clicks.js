const User = require('../models/User.js');


//==== TIME FUNCTION ===//
//var d = new Date("October 13, 2014 11:13:00");
function diff_minutes(Last_Click, Actual_Click) {

    //Formato -->''2011-10-09 12:00:02'';
    //Ajustar as strings dos clicks, justar as duas e meter nesse formato!
      var Actual_Click_Date = new Date(Actual_Click); //make the adjustments to make the string
      var Last_Click_Date = new Date(Last_Click); //make the adjustments to make the string
      var diff = Math.abs((Actual_Click_Date - Last_Click_Date)); // milliseconds between actual click & Last one!
      var minutes = ((diff/1000)/60);
      console.log("Minutes from last click:", minutes);
      return minutes;
    }


save_clicks=(client)=>{

    client.on('message', function (topic, message) {
        //==== Getting Data ===//
          if (topic === 'Clip1') { //place to define the topic @@@@@@ir buscar à base de dados
            Data = JSON.parse(message.toString());
            console.log(Data, topic);
        
            if (Data.State === "Pressed") {
        
              User.find({ Topic: topic }) //filter the topic
                .select({ "Clicks": { "$slice": -1 } })
                .exec(function (err, doc) {
        
                  console.log(doc,'doc');
                  if (err) return handleError(err);
        
        
                  var Last_click = doc[0].Clicks[0];
                  console.log(Last_click,'Last_click');
                  var Actual_click= Data.Time; //aranjar maneira de as strings ficarem no formato indicado!
        
                  if ( Last_click===undefined || diff_minutes(Last_click, Actual_click) > 60) {
                    console.log("entrou no update");
                    User.updateOne(
                      { Topic: topic }, //place to define the name
                      { $set: { Toma: true }},
                      { "$push": { "Clicks": Data.Time} },
                      function (err, raw) {
                        if (err) return handleError(err);
                        console.log('Sucess Click added AT'+ Data.Time);
                      })
                  } else{console.log('já clicou recentemente')}
        
        
                })
            }
          }
        })
        


}

module.exports = save_clicks;


//OIUTRAS TENTATIVAS

/*

//UPLOADING THE CLICKS TO THE DATABASE
      if( Data.State === "Pressed") {
        
        User.find({ username: 'teste2'})
        .select({ "Clicks": { "$slice": -1 }})
        .exec(function(err,doc) {
          var Last_click = doc[0].Clicks[0];}


        User.update(
          { "username": "teste2"}, //place to define the name
          { "$push": { "Clicks": Data.time } },
          function (err, raw) {
              if (err) return handleError(err);
              console.log('Sucess:Click added');
          } */
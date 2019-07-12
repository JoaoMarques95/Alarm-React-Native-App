const User = require('../models/User.js');

module.exports = (app) => {

    
app.post('/createuser', function(req, res) {

  const { body } =req;
    const {
        username,
        Topic,
        Full_Name,
        Email,
        Tell_number
    } = body;

    console.log('entrou no post')


/* User.find({ 
      username: username,
      Topic: Topic,
      Full_Name: Full_Name,
      Email: Email,
      Tell_number: Tell_number
       // the response will be only the equal emails!
  }, (err, users) =>{//if there is no match it returns an empty array!
    console.log(users)
      if(users.length !== 0){
        return res.send({
        success:false,
        message:'Repeated data' 
      });
      }

      if (err) {
        return res.send({
          success:false,
          message:'Error: server error',
        });
        }
    }
    ) */
   User.create({
          username: username,
          Topic:Topic,
          Full_Name: Full_Name,
          Email: Email,
          Tell_number: Tell_number,
        }).then(user => {
          console.log(user)
          console.log('Criou user');
          return res.send({
            success:true,
            message: user,
          });
        }).catch((err=>{console.log(err)}))



});

    
    }
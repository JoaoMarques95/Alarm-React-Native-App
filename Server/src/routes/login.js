
module.exports = (app,User) => {
app.post('/login', (req, res, next) =>{ //passing a post request into this route
    //sing-in--> Log in!.
    /*it´s a post request because we will just acept the date from the client
    (passwornd && email) see if it already exists in the Users.shema, and
    then log in. The client is not asking for any information!*/

    const { body } =req;
    const {
        username
    } = body;

    if (!username) {
      return res.send({
       success: false,
       message: 'Error : Name cannot be balnk.'   
      });
    }

//cheking if it is a valid user and check password
User.find({ 
  username: username // the response will be only the equal emails!
}, (err, users) =>{//if there is no match it returns an empty array!
    if(users.length === 0){
      return res.send({
      success:false,
      message:'Invalid Name!'
    });
    }

  if (err) {
    console.log(err,'erro err')
    return res.send({
      success:false,
      message:'Error: server error',
    });
    }      
    
    return res.send({
        success:true,
        message: 'Valid sign in',
      });
});
});
}
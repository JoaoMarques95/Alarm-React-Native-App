
const mongoose = require('mongoose');

//mongoose.Shema is a document data structure that is enforced via application layer!
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique:true,
    required: true,
    default: ''
  },
  Topic: {
    type: String,
    unique:true,
    required: true,
    default: ''
  },
  Clicks: {
    type: Array,
    default: []
  },
  Toma: {
    type: Boolean,
    default: false
  },
  Hora_Preferencia: {
    type: String,
    unique:true,
    required: true,
    default: ''
  },
  Comprimidos: {
    type: Number,
    default: null
  },
  Adiar_Notificação: {
    type: Number,
    default: 15
  },
  Days_Lost: {
    type: Array,
    default: []
  },


  //info to identify and contact the user
  Full_Name: {
    type: String,
    default: ''
  },
  Email: {
    type: String,
    unique:true,
    default: ''
  },
  Tell_number: {
    type: Number,
    unique:true,
    default: 0
  }
});

module.exports = mongoose.model('User', UserSchema);
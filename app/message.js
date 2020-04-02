var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create table message
var Message = new Schema({
	nick : String,
  msg :  String, 
  creat_Date :{type:Date,default:Date.now}
});

module.exports = mongoose.model('Message', Message);

'use strict';
var connection = require('./config');
    
//module.exports.authenticate=function(req,res){
module.exports = function authenticate(req,res) {
//module.exports.authenticate=function(req,res){
        //var r_name=req.body.room-name;
       var r_name=req.toString();
       var rname;
      
        connection.query('SELECT * FROM chat_room WHERE room_name = ?',[r_name], function (error, results, fields) {
          if (error) {
              /*
              res.send({
                status:false,
                message:'there are some error with query'
                })
                */
          }else{
            if(results.length >0){
                if(r_name == results[0].room_name){
                   // var curTemp = JSON.parse(results).main.temp;
                    //res.redirect('/token');
                    rname = results[0].room_name;
                    // console.log('Val is' +rname);
                  //return rname ;
                }else{
                    /*
                    res.send({
                      status:false,
                      message:"Room Name does not match"
                     });
                     */
                }
             
            }
            else{
              res.send({
                status:false,    
                message:"Room Name does not exits"
              });
            }
          }
        });
    }
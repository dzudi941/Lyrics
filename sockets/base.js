module.exports = function (io) {
  var express = require('express');
  var router = express.Router();
  var MongoClient = require('mongodb').MongoClient;
  var ConString = "mongodb://localhost:27017/my_db";
  var redis = require("redis"),
    client = redis.createClient();

   /*MongoClient.connect(ConString, function(err, db) {
    var users = db.collection('users');
    io.on('connection', function (socket) {
      users.find().toArray(function(err, data){
        data.forEach(function(val, index){
          var nsp = io.of('/'+val._id.toHexString());
          //socket.join(val._id.toHexString());
        });
      });

      /*socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
   });
  });*/

 /* var nsp = io.of('/my-namespace');
nsp.on('connection', function(socket){
  console.log('someone connected');
});
nsp.emit('hi', 'everyone!');*/
users = {};
io.on('connection', function(socket){
  socket.on('my id',  function (data) {
    console.log(data.myId);
    //users[data.myid] = socket.id;
    client.set(data.myId, socket.id);
    client.set(socket.id, data.myId);
    //console.log(users[data.myid]);
    client.get(data.myId, function (err, reply) {
      console.log(reply);
      client.rpush(['LoggedInUsers', data.myId], function(err, reply) {
    console.log(reply); //prints 2
});
client.lrange('LoggedInUsers', 0, -1, function(err, reply) {
    console.log(reply); 
    io.sockets.emit('updateAvailableUsers', reply);
});
/*client.lrem('frameworks', -2, "angularjs",function(err, reply) {
    console.log(reply); 
});*/
/*client.del('frameworks', function(err, reply) {
    console.log(reply);
});*/



      io.to(reply).emit('my message', { hello: 'world' });
    });
    });
    socket.on('sendToUser',  function (data) {
      console.log(data.userId);
      client.get(data.userId, function (err, reply) {
        console.log(reply);
        io.to(reply).emit('messageForMe', { toUsername: data.myid, fromUsername: data.userId, msg: data.myMsg });
      });
    });

         socket.on('disconnect', function(data) {
          console.log("neko se diskonektovao"+socket.id);
            //io.sockets.emit('GetLoggedInUsers');
            client.get(socket.id, function (err, username) {
              client.lrem('LoggedInUsers', -20, username,function(err, reply) {
                  console.log(reply); 
                  client.lrange('LoggedInUsers', 0, -1, function(err, reply1) {
                    console.log(reply1);
                    io.sockets.emit('updateAvailableUsers', reply1);
                   /* var logUsers=[]; 
                    for (var i = 0; i < reply1.length; i++) {
                      client.get(reply1[i]
                    }*/
                      //io.sockets.emit('updateAvailableUsers', {availableUsers: reply1});
                  });
                  
              });
            });


        });
        socket.on('UserDisconnected', function(data) {
            console.log("diskonektovan");
            console.log(data);
            client.lrem('LoggedInUsers', -20, data.myId,function(err, reply) {
                console.log(reply); 
                client.lrange('LoggedInUsers', 0, -1, function(err, reply1) {
                    io.sockets.emit('updateAvailableUsers', {availableUsers: reply1});
                });
                
            });

        });
  });
    //console.log(users);
 //socket.on('say to someone', function(id, msg){
  
  //});

  client.on("error", function (err) {
    console.log("Error " + err);
});
 
/*client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});*/
};

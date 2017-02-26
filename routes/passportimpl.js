var express = require('express');
const crypto = require('crypto');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
passport.use(new Strategy(
  function(username, password, cb) {
    findByUsername(username, function(err, user) {

      var secret = password;
      var hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
      console.log(hash);
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != String(hash)) { return cb(null, false); }
      return cb(null, user);
    });
    
    //console.log(hash);
    //console.log(password);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";


function findByUsername(username, cb) {
  process.nextTick(function() {
     MongoClient.connect(ConString, function(err, db) {
        if(err) { return console.dir(err); }
        var collection = db.collection('users');

        collection.findOne({username: username}, function(err, item){
          if (item==null) {
             return cb(null, null);
          }
          else
          {
            return cb(null, item);
          }
        });

      });
  });
}

function findById(id, cb) {
  process.nextTick(function() {
         MongoClient.connect(ConString, function(err, db) {
        if(err) { return console.dir(err); }
        var collection = db.collection('users');

        collection.findOne({id: id}, function(err, item){
          if (item==null) {
             cb(new Error('User ' + id + ' does not exist'));
          }
          else
          {
            cb(null, item);
          }
        });
      });
  });
}

router.get('/login',
  function(req, res){
    res.render('login');
  });

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/admin/waiting');
  });

router.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); 
  });
});

module.exports = router;
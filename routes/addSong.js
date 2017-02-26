var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";
/*var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); */

router.get('/addsong', function(req, res, next){
    MongoClient.connect(ConString, function(err, db) {
        if(err) { return console.dir(err); }
        var collection = db.collection('artists');
        collection.find().toArray(function(err, items) {
             res.render('addsong', {artists: items});
        });
       
    });
});

router.post('/addNewSong', function(req, res, next){
    MongoClient.connect(ConString, function(err, db) {
        if(err) { return console.dir(err); }
        var collection = db.collection('artists');
        console.log(req.body);
        var izvodjac;
        if (req.body.izvodjac=='-1') 
        {
          var collection = db.collection('artists');
          var artist = {name: req.body.newArtistName, genre: req.body.newArtistGenre, country: req.body.newArtistCountry, continent: req.body.newArtistContinent};
          collection.insert(artist, {w: 1}, function(err, records){
           // console.log(records.ops[0]._id);
            if (req.body.album=='-1') 
            {
              var collection = db.collection('albums');
              album = {name: req.body.newAlbumName, year: req.body.newAlbumYear, numSongs: req.body.newAlbumNumSongs, genre: req.body.newAlbumGenre, artistId: records.ops[0]._id.toHexString()};
              collection.insert(album, {w: 1}, function(err, records){
                  var collection = db.collection('songs');
                  song = {name: req.body.AddSongName, length: req.body.AddSongLength, link: req.body.AddSongLink, tags: req.body.AddSongTags, text: req.body.AddSongText, timestamp: + new Date(), status: "on waiting", albumId: records.ops[0]._id.toHexString(), views: 0};
                  collection.insert(song, {w: 1});
              });
            }
          });
        }
        else
        {
          if (req.body.album=='-1') 
          {
            var collection = db.collection('albums');
            album = {name: req.body.newAlbumName, year: req.body.newAlbumYear, numSongs: req.body.newAlbumNumSongs, genre: req.body.newAlbumGenre, artistId: req.body.izvodjac};
            collection.insert(album, {w: 1}, function(err, records){

              var collection = db.collection('songs');
              song = {name: req.body.AddSongName, length: req.body.AddSongLength, link: req.body.AddSongLink, tags: req.body.AddSongTags, text: req.body.AddSongText, timestamp: + new Date(), status: "on waiting", albumId: records.ops[0]._id.toHexString(), views: 0};
              collection.insert(song, {w: 1});
            });
          }
          else
          {
            var collection = db.collection('songs');
            song = {name: req.body.AddSongName, length: req.body.AddSongLength, link: req.body.AddSongLink, tags: req.body.AddSongTags, text: req.body.AddSongText, timestamp: + new Date(), status: "on waiting", albumId: req.body.album, views: 0};
            collection.insert(song, {w: 1});
          }
        }
        res.redirect('addsong');
    });
});

router.get('/getAlbums', function(req, res, next) {
     MongoClient.connect(ConString, function(err, db) {
      if(err) { return console.dir(err); }

      var collection = db.collection('albums');
      console.log(req.query.id);
      var id=String(req.query.id);
        collection.find({artistId : id}).toArray(function(err, results){
            console.log(results); // output all records
            res.send(results);
        });
    });
});
router.get('/getSongs', function(req, res, next) {
     MongoClient.connect(ConString, function(err, db) {
      if(err) { return console.dir(err); }

      var collection = db.collection('songs');
      console.log(req.query.id);
      var id=String(req.query.id);
        collection.find({albumId : id}).toArray(function(err, results){
            console.log(results); // output all records
            res.send(results);
        });
    });
});

/*router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(upload.array()); // for parsing multipart/form-data
router.use(express.static('public'));*/
module.exports = router;
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";
var getall = require ('./getall.js');
//var ObjectId = require('mongodb').ObjectID;




router.get('/', function(req, res, next) {
if (req.user)
  var userloggedIn=1;
else
  var userloggedIn=0;

var query = {status: "active"};
var sort = {timestamp : -1};
  getall.findallsort(query,sort, function(err, res1){
    var sort1 = {views : -1};
    getall.findallsort(query,sort1, function(err, res2){
    res.render('index', { songsNewest: res1 , songsViews: res2, userloggedIn: userloggedIn});
     });
  });
});


router.get('/mainsearch', function(req, res, next) {

  MongoClient.connect(ConString, function(err, db) {
    var songs = db.collection('songs');
    var albums = db.collection('albums');
    var artists = db.collection('artists');
    var keyword = req.query.key;
    var genres = req.query.genres;

    if(req.query.filterCountry == 0 && req.query.filterContinent == 0 && req.query.yearFrom == '' && req.query.yearTo =='' && genres==null) //kad filter nije ukljucen pretraga po nazivu 
    {
      if (keyword.indexOf('#') === 0)
        var songFind={tags: {'$regex': keyword, '$options' : 'i'}, status: "active"};
      else
        var songFind={'$or': [{name: {'$regex': keyword, '$options' : 'i'} }, {text: {'$regex': keyword, '$options' : 'i'} },], status: "active"};
      //console.log(songFind);
      artists.find({name: {'$regex': keyword , '$options' : 'i'}}).toArray(function(err, results2){
          albums.find({name: {'$regex': keyword , '$options' : 'i'}}).toArray(function(err, results1){
          songs.find(songFind).toArray(function(err, results){
      
          res.send({songs: results, albums: results1, artists: results2});
          });   
        });
      });

    }
    else //pretraga samo po nazivu pesama i filteru
    {
        if(req.query.filterCountry !=0 && req.query.filterContinent != 0)
          var artistFind = { country: req.query.filterCountry, continent: req.query.filterContinent};
        else if(req.query.filterCountry ==0 && req.query.filterContinent != 0)
          var artistFind = { continent: req.query.filterContinent};
        else if(req.query.filterCountry !=0 && req.query.filterContinent == 0)
          var artistFind = { country: req.query.filterCountry};
        else
          var artistFind={};

        
      
      artists.find(artistFind).toArray(function(err, results2){
        var artistsids=[];
        results2.forEach(function(val, index){
            artistsids.push(val._id.toHexString());
        });
        //console.log(artistsids);
        if(req.query.yearFrom != '' && req.query.yearTo !='')
          var albumsFind = {artistId: {'$in' : artistsids}, '$and': [{year: {'$gt': req.query.yearFrom}}, {year: {'$lt': req.query.yearTo}}] };
        else if(req.query.yearFrom != '' && req.query.yearTo =='')
          var albumsFind = {artistId: {'$in' : artistsids}, year: {'$gt': req.query.yearFrom} };
        else if(req.query.yearFrom == '' && req.query.yearTo !='')
          var albumsFind = {artistId: {'$in' : artistsids}, year: {'$lt': req.query.yearTo} };
        else
          var albumsFind = {artistId: {'$in' : artistsids} };
        
        console.log(req.query);
        if(genres!=null)
        {
          if(genres.length)
          {
            var gen={'$in': genres};
            albumsFind['genre']=gen;
          }
        }

        //console.log(albumsFind);
        albums.find(albumsFind).toArray(function(err, results1){
          var albumsids=[];
          results1.forEach(function(val, index){
              albumsids.push(val._id.toHexString());
          });
          songs.find({name: {'$regex': keyword, '$options' : 'i'}, status: "active", albumId: {'$in' : albumsids}}).toArray(function(err, results){
      
          res.send({songs: results, albums: results1, artists: results2});
          });   
        });
      });
    }

  });
});
/*router.get('/', function(req, res, next) {
    var it;
    MongoClient.connect("mongodb://localhost:27017/my_db", function(err, db) {
      if(err) { return console.dir(err); }

      var collection = db.collection('test');
     

        collection.findOne({mykey:1}, function(err, item) {
            console.log(item.fieldtoupdate);
            it=item;
            res.render('index', { title: item.fieldtoupdate.name });
        });
    });
});*/

module.exports = router;

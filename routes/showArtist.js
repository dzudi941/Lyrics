var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";
var ObjectId = require('mongodb').ObjectID;
var getall = require ('./getall.js');



router.get("/:id", function(req, res){
	
	var id=String(req.params.id);
	//console.log(id);
	MongoClient.connect(ConString, function(err, db) {
		var albums= db.collection('albums');
		var artists= db.collection('artists');
		var songs = db.collection('songs');
		albums.find({artistId : id}).toArray(function(err, albums){
			artists.findOne({_id : ObjectId.createFromHexString(id)}, function(err, artist){
				var albumsArr=[];
				albums.forEach(function(val, index){
					songs.find({albumId: val._id.toHexString(), status: "active"}).toArray(function(err, songs){
						albumsArr.push({album: val, songs: songs});
						if(index==albums.length-1)
							res.render("showartist", {artist: artist, albums: albumsArr, currAlbum: -1});
					});
					
				});
			});
			
		});
	});
	
});

router.get("/:id/:ida", function(req, res){
	
	var id=String(req.params.id);
	var ida=String(req.params.ida);
	//console.log(id);
	MongoClient.connect(ConString, function(err, db) {
		var albums= db.collection('albums');
		var artists= db.collection('artists');
		var songs = db.collection('songs');
		albums.find({artistId : id}).toArray(function(err, albums){
			artists.findOne({_id : ObjectId.createFromHexString(id)}, function(err, artist){
				var albumsArr=[];
				albums.forEach(function(val, index){
					songs.find({albumId: val._id.toHexString(), status: "active"}).toArray(function(err, songs){
						albumsArr.push({album: val, songs: songs});
						if(index==albums.length-1)
							res.render("showartist", {artist: artist, albums: albumsArr, currAlbum: ida});
					});
					
				});
			});
			
		});
	});
	
});



module.exports = router;
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";
var ObjectId = require('mongodb').ObjectID;
var getall = require ('./getall.js');



router.get("/:id", function(req, res){
	console.log(req.params.id);
	var id=String(req.params.id);
	console.log(id);
	MongoClient.connect(ConString, function(err, db) {
		var collection= db.collection('songs');
		collection.update({_id : ObjectId.createFromHexString(id)}, {$inc: {views: 1}});
	});

	var query = {_id : ObjectId.createFromHexString(id)};
	
	getall.findall(query, function(err, res1){
		//res.send(res1);
	   res.render("showSong", {all: res1});
	});


	/*MongoClient.connect(ConString, function(err, db) {
		var collection= db.collection('songs');
		var id=String(req.params.id);
		collection.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item) {
			res.render("showSong", {song: item});
		});
		
	});*/
});

router.post("/addComent", function(req, res){
	var id=String(req.body.songId);
	MongoClient.connect(ConString, function(err, db) {
		var collection= db.collection('songs');
		collection.update({_id : ObjectId.createFromHexString(id)}, {$push: {comments: {name: req.body.ime, comment: req.body.komentar, date: + new Date()}}});
	});
	res.redirect(id);
});


router.post("/updatecomment", function(req, res){
	var id=String(req.body.songId);
	MongoClient.connect(ConString, function(err, db) {
		var collection= db.collection('songs');
		console.log(req.body.forUpd);
		collection.update({_id : ObjectId.createFromHexString(id)}, {$push: req.body.forUpd});
	});
});

module.exports = router;
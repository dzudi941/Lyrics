var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";
var ObjectId = require('mongodb').ObjectID;
var getAll=require('./getall.js');
const crypto = require('crypto');
//var bodyParser = require('body-parser');




router.get('/waiting', function(req, res, next){
	if (req.user)
	{ 
		
		
		/*//var collection2= db.collection('artists');
		MongoClient.connect(ConString, function(err, db) {
        if(err) { return console.dir(err); }
        var collection= db.collection('songs');
        var artAlbSong=[];
        var middlearr;
	        collection.find({status: "on waiting"}).toArray(function(err, items) {
	        	//console.log(doc);
	        	items.forEach(function(val, index){
	        		collection = db.collection('songs');

	        			var collection1= db.collection('albums');
	        			var id = String(val.albumId);

		        		 collection1.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item1) {
		        		 	var collection2= db.collection('artists');
		        		 	var id = String(item1.artistId);
		        		 	collection2.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item2) {


					           middlearr={song: val, album: item1, artist: item2 };
					           //console.log(middlearr);
					            artAlbSong.push(middlearr);
					           // console.log(items.length);
					            if (index==items.length-1) {
					            	res.render('admin', {artAlbSong: artAlbSong});
					            }
					        });
				        });

	        	});
	        	//console.log(artAlbSong);
	  			//res.render('admin');
	  		});
	  	});*/
	  	var query={status: "on waiting"};
	  	getAll.findall(query, function(err, result){
	  		res.render('adminApp', {artAlbSong: result});
	  	});
	  	/*var query={status: "on waiting"};
	  	var sort={timestamp: -1};
	  	getAll.findallsort(query, sort, function(err, result){
	  		res.render('admin', {artAlbSong: result});
	  	});*/

	}
	else
	{
		console.log(req.user);
		res.redirect('/login');
	}
});

router.get('/all', function(req, res, next){
	if (req.user)
	{ 
	  	var query={};
	  	getAll.findall(query, function(err, result){
	  		res.render('adminAll', {artAlbSong: result});
	  	});
	}
	else
	{
		console.log(req.user);
		res.redirect('/login');
	}
});
router.get('/users', function(req, res, next){
	if (req.user)
	{ 
	  	MongoClient.connect(ConString, function(err, db) {
	  		var users = db.collection('users');
	  		users.find().toArray(function(err, results){
	  			//console.log(req.user);
	  			res.render('adminUsers', {users: results, loggedIn: req.user});
	  		});
	  	});
	}
	else
	{
		console.log(req.user);
		res.redirect('/login');
	}
});
router.post('/addNewUser', function(req, res, next){
	if (req.user)
	{ 
		//console.log(req.body);
	  	MongoClient.connect(ConString, function(err, db) {
	  		var users = db.collection('users');
	  		users.find({username: req.body.username}).toArray(function(err, results){
	  			if(results.length)
	  			{
	  				res.send({message: "Username već postoji morate odarati drugi"});
	  			}
	  			else
	  			{
	  				var secret = req.body.password;
			        var hash = crypto.createHmac('sha256', secret)
			                   .update('I love cupcakes')
			                   .digest('hex');
			        users.find().sort( { id: -1 } ).limit(1).toArray(function(err, data){
			        	//console.log(data.id);
			        	var newid=data[0].id+3;
			        	console.log(newid);
			        	users.insert({id: newid, username: req.body.username, password: hash});
			        	res.send({message: "Uspesno ste kreirali novog korisnika"});
			        });
	  				//users.insert()
	  			}

	  		});
	  	});
	}
	else
	{
		console.log(req.user);
		res.redirect('/login');
	}
});

router.post('/newMsg', function(req, res, next){
	if (req.user)
	{ 
		//console.log(req.body);
	  	MongoClient.connect(ConString, function(err, db) {
	  		var users = db.collection('users');
	  		//console.log(req.body.forUpd);
	  		users.update({username: req.body.userId}, {$push: req.body.forUpd});
	  	});
	}
	else
	{
		console.log(req.user);
		res.redirect('/login');
	}
});
router.post('/newMsgSameUser', function(req, res, next){
	if (req.user)
	{ 
		//console.log(req.body);
	  	MongoClient.connect(ConString, function(err, db) {
	  		var users = db.collection('users');
	  		//console.log(req.body.forUpd);
	  		users.update({username: req.body.userId}, {$push: req.body.forUpd});
	  	});
	}
	else
	{
		console.log(req.user);
		res.redirect('/login');
	}
});

router.post("/updateall", function(req, res) {
	MongoClient.connect(ConString, function(err, db) {
		//update song
		var collection= db.collection('songs');
		var ids=req.body.songId;
		var song = req.body.song;
		//console.log(req.body);
		//var obj=JSON.parse(req.body.song);
		collection.update({_id : ObjectId.createFromHexString(ids)}, {$set: song});

		//update album
		var collection= db.collection('albums');
		var idal=req.body.albumId;
		var album=req.body.album;
		collection.update({_id : ObjectId.createFromHexString(idal)}, {$set: album});

		//update artist
		var collection= db.collection('artists');
		var idar=req.body.artistId;
		var artist=req.body.artist;
		collection.update({_id : ObjectId.createFromHexString(idar)}, {$set: artist});

	});
});

router.post("/editSongAndGo", function(req, res){
	//console.log(req.body);
	MongoClient.connect(ConString, function(err, db) {
		var songs= db.collection('songs');
		songs.update({_id : ObjectId.createFromHexString(req.body.songId)}, {$set: {status: "on waiting"}});
		res.send({status: "OK"});
	});
});
router.post("/editSong", function(req, res){
	//console.log(req.body);
	MongoClient.connect(ConString, function(err, db) {
		var songs= db.collection('songs');
		songs.update({_id : ObjectId.createFromHexString(req.body.songId)}, {$set: {status: "on waiting"}});
		res.send({status: "OK"});
	});
});
//router.use(bodyParser.json()); // for parsing application/json
//router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

module.exports = router;
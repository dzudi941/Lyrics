var MongoClient = require('mongodb').MongoClient;
var ConString = "mongodb://localhost:27017/my_db";
var ObjectId = require('mongodb').ObjectID;
var getAll;
var getAll1;
getAll=function(query, cb)
{
    
	MongoClient.connect(ConString, function(err, db) {
    if(err) { return console.dir(err); }
    var collection= db.collection('songs');
    var artAlbSong=[];
    var middlearr;
        collection.find(query).toArray(function(err, items) {
            if (items.length) {
        	items.forEach(function(val, index){
        		collection = db.collection('songs');

        			var collection1= db.collection('albums');
        			var id = String(val.albumId);
                    //console.log(id);
	        		 collection1.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item1) {
	        		 	var collection2= db.collection('artists');
	        		 	var id = String(item1.artistId);
	        		 	collection2.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item2) {


				           middlearr={song: val, album: item1, artist: item2 };

				            artAlbSong.push(middlearr);
                            
				            if (index==items.length-1) {
				            	return cb(null, artAlbSong);
				            }

				        });
			        });

        	});
        	//console.log(artAlbSong);
  			//res.render('admin');
            }   
            else
               return cb(null, null); 
  		});
  	});
    //console.log(obj.arr);
    //return cb(null, obj.arr);
}
getAll1=function(query, sort, cb)
{
	MongoClient.connect(ConString, function(err, db) {
    if(err) { return console.dir(err); }
    var collection= db.collection('songs');
    var artAlbSong=[];
    var middlearr;
        collection.find(query).sort(sort).toArray(function(err, items) {
        	items.forEach(function(val, index){
        		collection = db.collection('songs');
        			var collection1= db.collection('albums');
        			var id = val.albumId;
	        		 collection1.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item1) {
	        		 	var collection2= db.collection('artists');
	        		 	var id = item1.artistId;
	        		 	collection2.findOne({_id : ObjectId.createFromHexString(id)}, function(err, item2) {
				           middlearr={song: val, album: item1, artist: item2 };
				            artAlbSong.push(middlearr);
				            if (index==items.length-1) {
				            	return cb(null, artAlbSong);
				            }
				        });
			        });
        	});
  		});
  	});
}
var get={findall: getAll, findallsort: getAll1};
module.exports = get;
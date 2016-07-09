var express = require('express');

//A router object is an isolated instance of middleware and routes. You can think of it as a "mini app"
var router = express.Router();
//Rounter is to handle http methods routes such as get, put, post , get 
//

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello World!' });
});


/* GET Userlist page. */
//userlist page - connecting userlist.jade page to get information from database

router.get('/userlist', function(req, res) {
	
	//got instance of db;
    var db = req.db;
	//getting collection stored in MongoDb
    var collection = db.get('userCollection');
	
	//find is method of mongoDb.. since collection is instance of db , it can access and understand that method
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});




// adding newuser file to add new user 
//setting title variable, which would allow Jade to set the title
router.get('/newuser', function(req, res){
	res.render('newuser', {title : 'Add New User'});
});


//Adding new User
router.post('/adduser',function(req, res){
	
	var db = req.db;
	
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	
	var collection = db.get('userCollection');
	
	//submit to your database
	collection.insert({
		
		"username" : userName,
		"email" : userEmail
		
	}, function (err, doc){
		if(err){
			res.send("there was problem adding info to database");
			
		}
		else{
			res.redirect("userlist");
		}
	
	});
	
});

//delete user 
router.get('/deleteuser', function(req, res){
	res.render('deleteuser', {title : 'Delete User From TapAPlate'});
});

//delete user action
router.post('/userdel', function(req, res){
	
	var db = req.db; 
	var collection = db.get('userCollection');
	
	var userName = req.body.username;
	
	collection.remove({
		"username" : userName
	}, function (err, doc){
		
		if(err){
			res.send("Error deleting user! Try again!");
		}
		else{
			res.redirect("/");
		}
		
	});
});



module.exports = router;

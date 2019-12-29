var express = require('express');
var app = express();
var mysql = require('mysql2');
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(express.static('./'));
app.set('view-engine','ejs');
var config = require('./config.js');

var db=mysql.createPool(config.dbSettings);
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


async function executeQuery(query){
    try{
  let result = await db.promise().query(query);
  return result[0];
  }
  catch(err){
    console.log(err);
  }
}

 app.get('/', async function(req, res) {
  let date = new Date();
  req.session.failedLogin=false;
   res.render('index.ejs', {date : date,session : req.session});
});

app.get('/login',async function(req,res){

  let date = new Date();
    if(req.session.loggedin){
      res.redirect('/');
    }
    else{
      res.render('login.ejs', {date: date,session : req.session});
    }
});


app.get('/logout',function(req,res){
  req.session.loggedin=false;
  req.session.username='';
  res.redirect('/');
});

 app.post('/auth', async function(req, res) {
	var username = req.body.login;
	var password = req.body.password;
	if (username && password) {
    const credentials = await executeQuery('SELECT User_Name,Password,Authorization_Level FROM User WHERE Password = "' + password + '" AND User_Name = "' + username + '";')
			if (credentials.length > 0) {
        req.session.failedLogin=false;
				req.session.loggedin = true;
        req.session.username = username;
        req.session.userPrivilege = credentials[0].Authorization_Level;
				res.redirect('/');
			} else {
        req.session.failedLogin=true;
        res.redirect('/login')
			}	
			res.end();
	} else {
    req.session.failedLogin=true;
		res.redirect('/login')
		res.end();
	}
});


app.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');
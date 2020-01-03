var express = require('express');
var app = express();
var mysql = require('mysql2');
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(express.static('./static/'));

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
    throw(err);
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
  req.session.userPrivilege = 0;
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

app.get('/deviceList',async function(req,res){

  
  let date = new Date();
  if(req.session.userPrivilege>5){
    const dbData = await executeQuery('SELECT * FROM Device_Detailed; ' + 'SELECT Room_ID,Room_Name FROM Room; ' +
    'SELECT Type_Name,Type_ID FROM Type;')
    res.render('deviceList.ejs',{devices: dbData[0], session: req.session,date: date,rooms: dbData[1],types: dbData[2]});
  }
  else{
    const devices = await executeQuery('SELECT * FROM Device_Detailed;');
    res.render('deviceList.ejs',{devices: devices, session: req.session,date: date});
  }
});

app.post('/deviceList', async function(req,res){

  if(!req.body.Notifications_Enabled){
    req.body.Notifications_Enabled=false;
  }
  if(req.body.Notifications_Enabled=="true"){
    req.body.Notifications_Enabled = true;
  }

  let updateQuery = 'UPDATE Device SET' +
  ' Device_Name = \'' + req.body.Device_Name +
  '\', Room_ID = ' + req.body.Room_ID +
  ', Power_Consumption = ' + req.body.Power_Consumption +
  ', Authorization_Level = ' + req.body.Authorization_Level +
  ', Notifications_Enabled = ' + req.body.Notifications_Enabled +
  ', IP_Address = \'' + req.body.IP_Address +
  '\', Type_ID = ' + req.body.Type_ID +
  ' WHERE Device_Name = \'' + req.body.Device_Name_OLD + "\';";
  await executeQuery(updateQuery);

  res.redirect('/deviceList');
})

app.post('/addDevice' ,async function(req,res){

  if(!req.body.Notifications_Enabled){
    req.body.Notifications_Enabled=false;
  }
  if(req.body.Notifications_Enabled=="true"){
    req.body.Notifications_Enabled = true;
  }


  let insertQuery = 'INSERT INTO Device (Device_Name,Room_ID,Power_Consumption,Authorization_Level,Notifications_Enabled,IP_Address,Type_ID)' +
  '\nVALUES(\'' + req.body.Device_Name + '\', ' + req.body.Room_ID + ', ' + req.body.Power_Consumption + ', ' + req.body.Authorization_Level +
  ', ' + req.body.Notifications_Enabled + ', \'' + req.body.IP_Address + '\', ' + req.body.Type_ID + ');';

  try{
  await executeQuery(insertQuery);
  }
  catch(err){
    req.session.sqlError = err.code;
  }
  res.redirect('/deviceList');
})

app.post('/removeDevice',async function(req,res){
  let removeQuery = 'DELETE FROM Device WHERE Device_Name = \'' + req.body.Device_Name + '\';'
  await executeQuery(removeQuery);
  res.end()
})

app.post('/revalidateAdmin', async function(req,res){
  var username = req.body.login;
	var password = req.body.password;
	if (username && password) {
    try{
    const credentials = await executeQuery('SELECT User_Name,Password,Authorization_Level FROM User WHERE Password = "' + password + '" AND User_Name = "' + username + '";')
			if (credentials.length > 0) {
        res.send('true')
      }
      else{
        res.send('false')
      }
    }catch(err){
      console.log(err)
  }
  }
    else{
      res.send('false')
    }
  res.end();
})

app.post('/deviceGroups',async function(req,res){

    var device = req.body.Device_Name
    let getQuery = "SELECT Group_Name FROM Device_Groups WHERE Device_Name = \'" + device + "\';"
    const groups = await executeQuery(getQuery)
    res.send(groups)
})

app.get('/schedules',async function(req,res){
  let selectQuery='SELECT * FROM Weekly_Plan; SELECT * FROM Task; SELECT * FROM Custom_Script; SELECT Device_Name,Device_ID,Type_ID FROM Device;'
  const results = await executeQuery(selectQuery)
  let date=new Date()
  res.render('schedules.ejs',{date: date,session: req.session,schedule: results[0],tasks: results[1],scripts: results[2],devices: results[3]})
})

app.post('/addScheduleItem', async function(req,res){
  if(req.body.Was_Custom_Script=='true'){
    req.body.Was_Custom_Script=true
  }
  else{
    req.body.Was_Custom_Script=false
  }
  let insertQuery = 'INSERT INTO Schedule(Device_ID,Start_Time,End_Time,Day,Was_Custom_Script,'
  let commonValue = ('VALUES('+ req.body.Device_ID +',\''+req.body.beginH+':'+req.body.beginM+':'+req.body.beginS+'\',\''+
  req.body.endH+ ':' + req.body.endM + ':' + req.body.endS+'\','+req.body.Day + ',' +req.body.Was_Custom_Script + ',' +
  req.body.Job +');')
  
  if( req.body.Was_Custom_Script==true){
    insertQuery+='Script_ID)\n'
  }
  else{
    insertQuery+='Task_ID)\n'
  }
  insertQuery+=commonValue
  await executeQuery(insertQuery)
  res.redirect('/schedules')
})

app.post('/removeScheduleItem', async function(req,res){
  let removeQuery=('DELETE FROM Schedule WHERE Schedule_ID=' + req.body.Schedule_ID + ';')
  await executeQuery(removeQuery)
  res.redirect('/schedules')
})

app.listen(config.serverSettings.port, config.serverSettings.ipAddress);
console.log('Server running at http://'+config.serverSettings.ipAddress+':'+config.serverSettings.port+'/');





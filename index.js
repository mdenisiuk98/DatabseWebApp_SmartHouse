var express = require('express');
var app = express();
var mysql = require('mysql2');
app.use(express.static('./'));
app.set('view-engine','ejs');

var db=mysql.createPool({
  host: 'localhost',
  user: 'mati',
  password: 'zxc',
  database: 'smart_house',
    typeCast: function castField( field, useDefaultTypeCasting ) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            var bytes = field.buffer();

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );

}
});


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
  let lista=[];
    const temp= await executeQuery('SELECT * FROM Device_Detailed');
    for(let i=0;i<temp.length;i++){
      lista.push(temp[i].Device_Name);
        lista.push(temp[i].Room_Name);
        lista.push(temp[i].Power_Consumption);
        lista.push(temp[i].Status_ON_OFF);
        lista.push(temp[i].Type_Name);
        lista.push(temp[i].IP_Address);
    }
	let date = new Date();

	console.log('Request indexu - ' + date +'Obecnie aktywnych ' + (db._allConnections.length ) + 'polaczen.\n');
   res.render('index.ejs', {lista : lista,date : date});
});


app.listen(3000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:3000/');``
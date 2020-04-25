fs = require("fs");

var product_metadata = [];

var current_char = "";

fs.readFile('../data/inventory_data.csv', 'utf-8', 
  function (err, data)  {
    if (err) {
      throw err;
    } else {
      

    var whole_set = "";

    var create_table_query_string = "";
    var current_item = "";
    
    var comma_char = ",";
    var quote_char = "\"";
    
    var current_comma_location = 0;
    var next_comma_location;
    var quote_location;

    whole_set = data;

    logIntoDatabase();

    createDatabase("palko_inventory");

    createTable("palko_inventory")



    
    }

    
  }
);

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "potus",
  password: "h@m!1t0n"
});


function logIntoDatabase() {
  con.connect(
    function(err) {
      if (err) throw err;
      console.log("Connected!");
    }
  );
}

function createDatabase(database_name) {
  var query_string = "";

  query_string = "CREATE DATABASE IF NOT EXISTS " + database_name;
  con.query(query_string, function (err, result) {
    if (err) throw err;
    console.log("Database " + database_name + " created.");

    con.end();
  });
}

function createTable(table_type)  {
  var create_table_query_string = "";

  var create_table_query_string = "USE " + table_type + "; ";

  con.query(create_table_query_string, 
    function (err, result) {
      if (err) throw err;
      console.log("Connected to " + table_type + ".");
    }
  );
  
  switch (table_type) {
    case "palko_inventory":
      // create_table_query_string = create_table_query_string + "CREATE TABLE customers (name VARCHAR(255),\n address VARCHAR(255))";
      create_table_query_string = "CREATE TABLE full_inventory (StoreID SMALLINT(6) AUTO_INCREMENT, Brand VARCHAR(36), Name VARCHAR(48) NOT NULL, Size VARCHAR(6), ItemID SMALLINT(7) NOT NULL, UPC SMALLINT(16) NOT NULL, WholesalePrice VARCHAR(6), RetailPrice VARCHAR(6) NOT NULL, Discount VARCHAR(6), FinalPrice VARCHAR(6) NOT NULL, MAPprice VARCHAR(6), OnHand VARCHAR(4), Allocated VARCHAR(4), QtyAvailable VARCHAR(4), Weight VARCHAR(8), Length VARCHAR(8), Width VARCHAR(8), Height VARCHAR(8), Category VARCHAR(12), Subcategory VARCHAR(12), HasMAP BIT, MAPfile TINYTEXT, Prop65 BIT, PRIMARY KEY (StoreID));"; 
    break;
  }

  con.query(create_table_query_string, 
    function (err, result) {
      if (err) throw err;
      console.log("createTable complete");
    }
  );

  
}

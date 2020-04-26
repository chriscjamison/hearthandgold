// fs = require("fs");
https = require("https");

rawData = "";

// fs.readFile('../data/inventory_data.csv', 'utf-8', 
https.get('https://www.palkoservices.com/get/customer_itemlist&cust=9999924928',
  function (res)  {
    res.on("data", 
      function (chunk)  {
        rawData = rawData + chunk;
      }
    );

    res.on("end",  
      function ()  {
        var whole_set = "";

        var insert_row_query_string = "";
        var current_item = "";
        
        var comma_char = ",";
        var quote_char = "\"";
        
        var current_comma_location = 0;
        var next_comma_location;
        var quote_location;

        var num_of_total_chars;

        var prev_item_contains_quotes;
        var last_item_containing_quotes;

        var end_of_file;
        var brand_contains_quotes;

        var i = 0;
        var j = 0;

        whole_set = rawData;

        num_of_total_chars = whole_set.length;

        logIntoDatabase();

        createDatabase("palko_inventory");

        createTable("palko_inventory");

        end_of_file = false;
        brand_contains_quotes = false;

        last_item_containing_quotes = 0;

        while (end_of_file === false) {
          if (j === 0)  {
            for (i = 0; i <= 20; i++) {
              next_comma_location = whole_set.indexOf(comma_char, current_comma_location);

              current_comma_location = next_comma_location + 1;

              if (i === 20) {
                i++;

                current_comma_location = current_comma_location + 8;
              }
            }

            j = 1;
          } else {
            insert_row_query_string = "INSERT INTO full_inventory (Brand, Name, Size, ItemID, UPC, WholesalePrice, RetailPrice, Discount, FinalPrice, MAPprice, OnHand, Allocated, QtyAvailable, Weight, Length, Width, Height, Category, Subcategory, HasMAP, MAPfile, Prop65) VALUES ("; 

            for (i = 0; i <= 21; i++) {
              next_comma_location = whole_set.indexOf(comma_char, current_comma_location);

              if (i === 0)  {
                quote_location = current_comma_location;

                current_char = whole_set.charAt(quote_location);

                if (current_char === quote_char)  {
                  current_item = whole_set.slice((quote_location + 1), (whole_set.indexOf(quote_char, (quote_location + 1))))

                  current_comma_location = whole_set.indexOf(quote_char, (quote_location + current_item.length)) + 2;

                  next_comma_location = whole_set.indexOf(comma_char, current_comma_location);

                  brand_contains_quotes = true;
                } else {
                  current_item = whole_set.slice(current_comma_location, next_comma_location);

                  current_comma_location = next_comma_location + 1; 
                }

                insert_row_query_string = insert_row_query_string + "\"" + current_item + "\", ";
              } else if (i === 1)  {
                quote_location = current_comma_location;

                current_char = whole_set.charAt(quote_location);

                if (current_char === quote_char)  {
                  current_item = whole_set.slice((quote_location + 1), (whole_set.indexOf(quote_char, (quote_location + 1))));

                  prev_item_contains_quotes = true;

                  current_comma_location = whole_set.indexOf(quote_char, (quote_location + current_item.length)) + 2;
                } else {
                  prev_item_contains_quotes = false;

                  current_item = whole_set.slice(current_comma_location, next_comma_location);
                  
                  current_comma_location = next_comma_location + 1;  
                }

                insert_row_query_string = insert_row_query_string + "\"" + current_item + "\", ";
              } else if (i === 2) {
                quote_location = next_comma_location - 1;

                current_char = whole_set.charAt(quote_location);

                if (current_char === quote_char)  {
                  current_item = whole_set.slice(current_comma_location, quote_location);
                } else {
                  current_item = whole_set.slice(current_comma_location, next_comma_location);
                }

                insert_row_query_string = insert_row_query_string + "\"" + current_item + "\", ";

                current_comma_location = next_comma_location + 1;  
              } else if (i === 21) {
                current_char = whole_set.charAt(current_comma_location);

                if (current_char === "Y" || current_char === "N") {
                  insert_row_query_string = insert_row_query_string + "\"" + current_char + "\");";
                } 

                current_comma_location = current_comma_location + 3;

                if (brand_contains_quotes === true) {
                  brand_contains_quotes = false;
                }

                if (i - 1 === last_item_containing_quotes)  {
                  last_item_containing_quotes = 0;                
                  current_comma_location = current_comma_location + 1;
                } else if (prev_item_contains_quotes === true) {
                  last_item_containing_quotes = i;
                }
              } else {
                current_item = whole_set.slice(current_comma_location, next_comma_location);
                
                insert_row_query_string = insert_row_query_string + "\"" + current_item + "\", ";

                current_comma_location = next_comma_location + 1;  
              }
            }  
            
            addItemToDatabase("palko_inventory", insert_row_query_string);
          }

          if (num_of_total_chars - current_comma_location <= 100) {
            end_of_file = true;
          } 

          j++;
        }

      
      }
    );
    
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

  create_table_query_string = "USE " + table_type + ";";

  con.query(create_table_query_string, 
    function (err, result) {
      if (err) throw err;
      console.log("Connected to " + table_type + ".");
    }
  );
  
  switch (table_type) {
    case "palko_inventory":
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

function addItemToDatabase(table_type, insert_row_query_string) {
  var use_database_query_string = "";

  use_database_query_string = "USE " + table_type + ";";

  con.query(use_database_query_string, 
    function (err, result) {
      if (err) throw err;
    }
  );

  con.query(insert_row_query_string, 
    function (err, result) {
      if (err) throw err;
    }
  );
}

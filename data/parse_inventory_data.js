https = require("https");
fs = require("fs");

var product_metadata = [];

var current_char = "";

var rawData = "";

/* {
    res.on("data", 
      function (chunk)  {
        rawData = rawData + chunk;
      }
    );

    res.on("end",  
      function ()*/

//  

// fs.readFile('inventory_data.csv', 'utf-8', 
https.get('https://www.palkoservices.com/get/customer_itemlist&cust=9999924928',
  function (res)  {
    res.on("data", 
      function (chunk)  {
        rawData = rawData + chunk;
      }
    );

    res.on("end",  
      function ()  {
        var product_data = [];
        var current_item = "";

        var whole_set = rawData;
        
        var comma_char = ",";
        var quote_char = "\"";
        
        var current_comma_location = 0;
        var next_comma_location;
        var quote_location;
                
        var num_of_total_chars;

        num_of_total_chars = whole_set.length;

        var i = 0;
        var j = 0;
        var x = 0;
        var y = 0;
        var b = 0;   

        var modulus_val = 0;
        var current_id_num = 3;

        var item_data = "";
        var product_list = "";

        var prev_item_contains_quotes;
        var last_item_containing_quotes = 0;

        var end_of_file = false;
        var brand_contains_quotes = false;

        while (end_of_file === false) {
          if (j === 0)  {
            for (i = 0; i <= 21; i++) {
              next_comma_location = whole_set.indexOf(comma_char, current_comma_location);

              product_metadata[i] = whole_set.slice(current_comma_location, next_comma_location).trim();

              current_comma_location = next_comma_location + 1;

              if (i === 20) {
                i++;

                current_char = whole_set.charAt(current_comma_location);

                if (current_char === "P") {
                  product_metadata[i] = "Prop65";
                } 

                current_comma_location = current_comma_location + 8;
              }
            }

            j = 1;

          } else {
            for (y = 0; y <= 21; y++) {
              next_comma_location = whole_set.indexOf(comma_char, current_comma_location);

              if (y === 0)  {
                quote_location = current_comma_location;

                current_char = whole_set.charAt(quote_location);

                if (current_char === quote_char)  {
                  current_item = whole_set.slice((quote_location + 1), (whole_set.indexOf(quote_char, (quote_location + 1))))

                  product_data.push(current_item);

                  current_comma_location = whole_set.indexOf(quote_char, (quote_location + current_item.length)) + 2;

                  next_comma_location = whole_set.indexOf(comma_char, current_comma_location);

                  brand_contains_quotes = true;
                } else {
                  current_item = whole_set.slice(current_comma_location, next_comma_location);
                
                  product_data.push(current_item);

                  current_comma_location = next_comma_location + 1; 
                }
              } else if (y === 1)  {
                quote_location = current_comma_location;

                current_char = whole_set.charAt(quote_location);

                if (current_char === quote_char)  {
                  current_item = whole_set.slice((quote_location + 1), (whole_set.indexOf(quote_char, (quote_location + 1))));

                  product_data.push(current_item);


                  prev_item_contains_quotes = true;

                  current_comma_location = whole_set.indexOf(quote_char, (quote_location + current_item.length)) + 2;
                } else {
                  prev_item_contains_quotes = false;

                  current_item = whole_set.slice(current_comma_location, next_comma_location);
                  
                  product_data.push(current_item);

                  current_comma_location = next_comma_location + 1;  
                }
              } else if (y === 21) {
                y++;

                current_char = whole_set.charAt(current_comma_location);

                if (current_char === "Y" || current_char === "N") {
                  product_data.push(current_char);   
                } 

                current_comma_location = current_comma_location + 3;

                if (brand_contains_quotes === true) {
                  brand_contains_quotes = false;
                }

                if (x - 1 === last_item_containing_quotes)  {
                  last_item_containing_quotes = 0;                
                  current_comma_location = current_comma_location + 1;
                } else if (prev_item_contains_quotes === true) {
                  last_item_containing_quotes = x;
                }            
              } else {
                current_item = whole_set.slice(current_comma_location, next_comma_location);
                
                product_data.push(current_item);

                current_comma_location = next_comma_location + 1;  
              }

              modulus_val = x % 22;

              

              //console.log("current_id_num = " + current_id_num);
              //console.log("Product ID#:" + product_data[current_id_num] + " | " + product_metadata[modulus_val] + " = " + product_data[x] + "\n");
    
    // console.log("item_data = \n" + item_data);

    // console.log("x = " + x.toString());
              x++;

              if (x > 21 && x % 22 === 0) {
                for (b = 0; b <= 21; b++) {
                  // console.log("b = " + b);
                  product_list = product_list + "Product ID#:" + product_data[3] + " | " + product_metadata[b] + " = " + product_data[b] + "\n";
                }
      
                product_list = product_list + "\n";
              }

              
            }

            

            

            
          }

          

          if (num_of_total_chars - current_comma_location <= 100) {
            end_of_file = true;
          }    
        }

  // console.log("product_list = \n" + product_list);

        fs.writeFile("parsed_data.txt", product_list, 
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("file is written.");
            }
          }
        );
      }
    );
  }
); 





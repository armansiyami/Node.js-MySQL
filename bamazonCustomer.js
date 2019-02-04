var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: `bamazon`

});


function showTable () {
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res);
    });
}


    connection.connect(function (err) {
        
        showTable();
        setTimeout(runSearch, 1000);
    
    
        
    });
    




function runSearch() {
    inquirer
    .prompt({
        name: "inputProduct",
        type: "input",
        message: "What would you like to buy? (Q to Quit)",
        
    })
    .then(answers => {
        var searchTerm = answers.inputProduct;
        if (searchTerm == 'q' | searchTerm == 'Q') {
            connection.end();
        } else {
            inquirer
            .prompt(
            {
                name: "quantity",
                type: "input",
                message: `How many units of ${searchTerm} would you like to purchase?`
            })
            .then(answers => {
            var quantity = parseInt(answers.quantity);
            itemSearch(searchTerm,quantity);
            
          });
        }
      
    });
};

function itemSearch(searchTerm, quantity) {
    var query = "SELECT ID, stock_quantity, price  FROM products WHERE name = ?";
    connection.query(query, [searchTerm ], function (err, res) {
        var ID = res[0].ID;
        var stock = res[0].stock_quantity;
        var price = res[0].price;

        if (quantity > stock)
        {
            console.log("Insufficient quantity!")
            setTimeout(showTable, 800);
            setTimeout(runSearch, 1000);
        } else 
        {
            updateStock(searchTerm,ID,quantity,price);
        }
    });

}

function updateStock(searchTerm,ID,quantity,price){
    totalPrice = price * quantity;
    connection.query(`
    UPDATE products SET
    stock_quantity = stock_quantity - ?
    WHERE ID = ?;`
    , [quantity, ID], function (err, res){
        console.log(`Purchased ${quantity} units of ${searchTerm} for $${totalPrice} dollars!`);
        setTimeout(showTable, 800);
        setTimeout(runSearch, 1000);
    })
}

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

function showTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res);
    });
}


connection.connect(function (err) {

    
    setTimeout(runSearch, 1000);



});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    showTable();
                    setTimeout(runSearch, 1000);
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    inquirer
                    .prompt([
                        {
                            name: "ID",
                            message: "Input item ID you would like to add inventory for?"
                        
                        
                        },
                        {
                            name: "stock_quantity",
                            message: "Input new inventory amount: "
                        }
                    ])   
                    .then(function(answers){
                        addInventory(answers.ID, answers.stock_quantity)
                    })
                    break;

                case "Add New Product":
                inquirer
                .prompt([
                    {
                        name: "name",
                        message: "Item Name?"
                    },
                    {
                        name: "category",
                        message: "Category?"
                    },
                    {
                        name: "price",
                        message: "Price?"
                    },
                    {
                        name: "stock_quantity",
                        message: "Item Quantity?"
                    }

                ])
                .then(function(answers) {
                    newProduct(answers.name,answers.category,answers.price,answers.stock_quantity);
                })
                    break;
                

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function lowInventory() {
    var query = "SELECT ID, name, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        console.log("These Items are low on inventory");
        console.table(res);
        setTimeout(runSearch,2000);
    });
}



function addInventory(ID,stock_quantity){
    connection.query(`
    UPDATE products SET
    stock_quantity = ?
    WHERE ID = ?;
    `, [stock_quantity, ID], function (err, res){
        if (err) throw err;
        console.log(`Product:${ID} Updated Inventory: ${stock_quantity}`)
    }) 
    setTimeout(runSearch, 1000);

}



function newProduct(name,category,price,stock_quantity) {
    connection.query(`
    INSERT into products (name, category, price, stock_quantity) VALUES (?,?,?,?)
    `, [name, category, price, stock_quantity], function (err, res){
        if (err) throw err;
        console.log(`New Product: ${name} Added!`)
    })
    setTimeout(runSearch, 1000);
}
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});
//get add recipe request
exports.getaddrecipe = (req, res) => {
    console.log("Going to Add Recipe Page");
    console.log("Current Housewife is :" + process.env.HOUSEWIFE_ID);
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session Expired Login Again."
        res.render('logintry', { message });
    }
    res.render('addrecipe');
}

//get add product request
exports.getaddproduct = (req, res) => {
    console.log("Going to Add Product Page");
    console.log("Current Housewife is :" + process.env.HOUSEWIFE_ID);
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session Expired Login Again."
        res.render('logintry', { message });
    }
    res.render('addproduct');
}

//insert recipe housewife
exports.insertrecipe = (req, res) => {
    const { Ingredients, Rname, Rdesc, RImage } = req.body;
    console.log(Ingredients, Rname, Rdesc, RImage);
    let first_name, last_name;
    db.query('SELECT h_first_name,h_last_name from housewife where housewife_id = ?', [process.env.HOUSEWIFE_ID], (err, result) => {
        if (!err) {
            first_name = result[0].h_first_name;
            last_name = result[0].h_last_name;
            console.log(first_name, last_name);
        } else {
            console.log(err);
        }
    });
    db.query('INSERT INTO recipe set?', {
        housewife_id: process.env.HOUSEWIFE_ID,
        Ingredients: Ingredients,
        Rname: Rname,
        Rdesc: Rdesc,
        RImage: RImage,

    }, (err, rows) => {
        if (!err) {
            console.log("Recipe added successfully");
            console.log(rows);
            res.render('dashboard');
        }
    })
}

//get insert product req in housewife table
exports.insertproduct = (req, res) => {
    const { item_name, item_details, item_price, item_image } = req.body;
    console.log(item_name, item_details, item_price, item_image);
    let first_name, last_name;
    db.query('SELECT h_first_name,h_last_name from housewife where housewife_id = ?', [process.env.HOUSEWIFE_ID], (err, result) => {
        if (!err) {
            first_name = result[0].h_first_name;
            last_name = result[0].h_last_name;
            console.log(first_name, last_name);
        } else {
            console.log(err);
        }
    });
    db.query('INSERT INTO ITEM set?', {
        housewife_id: process.env.HOUSEWIFE_ID,
        item_name: item_name,
        item_details: item_details,
        item_image: item_image,
        item_price: item_price,

    }, (err, rows) => {
        if (!err) {
            console.log("Item added successfully");
            console.log(rows);
            res.render('dashboard');
        }
    })
}

//get view items req
exports.viewitems = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        db.query('SELECT ITEM.item_id,ITEM.housewife_id,ITEM.item_name,ITEM.item_details,ITEM.item_image,ITEM.item_price,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name FROM ITEM join housewife ON ITEM.housewife_id = HOUSEWIFE.housewife_id && ITEM.housewife_id =?', [process.env.HOUSEWIFE_ID],
            (err, rows) => {
                if (!err) {
                    res.render('hviewitems', { rows });
                } else {
                    console.log(err);
                }
            })

    }
}

//get view recipes req
exports.viewrecipes = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        db.query('SELECT recipe.R_id,recipe.housewife_id,recipe.Rname,recipe.Rdesc,recipe.RImage,recipe.Ingredients,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name FROM recipe join housewife ON recipe.housewife_id = HOUSEWIFE.housewife_id && recipe.housewife_id =?', [process.env.HOUSEWIFE_ID],
            (err, rows) => {
                if (!err) {
                    res.render('hviewrecipes', { rows });
                } else {
                    console.log(err);
                }
            })
    }
}

//delete items
exports.deleteproduct = (req, res) => {
        if (process.env.HOUSEWIFE_ID == undefined) {
            const message = "Session expired please login again"
            res.render('logintry', { message });
        } else {
            const id = req.params.id
            db.query('DELETE FROM CART where item_id = ?', [id], (err, row) => {
                if (!err) {
                    console.log("Items removed from cart");
                    console.log(row);
                }
            });
            db.query('DELETE FROM ITEM where item_id = ?', [id], (err, row) => {
                if (!err) {
                    console.log(row);
                    console.log("Item deleted successfully");
                    db.query('SELECT ITEM.item_id,ITEM.housewife_id,ITEM.item_name,ITEM.item_details,ITEM.item_image,ITEM.item_price,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name FROM ITEM join housewife ON ITEM.housewife_id = HOUSEWIFE.housewife_id && ITEM.housewife_id =?', [process.env.HOUSEWIFE_ID],
                        (error, rows) => {
                            if (!error) {
                                res.render('hviewitems', { rows });
                            } else {
                                console.log(error);
                            }
                        });

                } else {
                    console.log(err);
                }
            });
        }
    }
    //delete recipes
exports.deleterecipe = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    }
    /*else {
               const id = req.params.id
               db.query('DELETE FROM CART where item_id = ?', [id], (err, row) => {
                   if (!err) {
                       console.log("Items removed from cart");
                       console.log(row);
                   }
               });*/
    const id = req.params.id
    db.query('DELETE FROM recipe where R_id = ?', [id], (err, row) => {
        if (!err) {
            console.log(row);
            console.log("Recipe deleted successfully");
            db.query('SELECT recipe.R_id,recipe.housewife_id,recipe.Rname,recipe.Rdesc,recipe.RImage,recipe. Ingredients,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name FROM recipe join housewife ON recipe.housewife_id = HOUSEWIFE.housewife_id && recipe.housewife_id =?', [process.env.HOUSEWIFE_ID],
                (error, rows) => {
                    if (!error) {
                        res.render('hviewrecipes', { rows });
                    } else {
                        console.log(error);
                    }
                });

        } else {
            console.log(err);
        }
    });
}


// housewife view orders get req
exports.vieworders = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        /*Query that will return the customer first name and last name of customer
         */
        const hid = process.env.HOUSEWIFE_ID;
        const sql = `SELECT orders.order_id,orders.order_details,orders.total_price,
       orders.quantity,orders.order_time,housewife.h_first_name,housewife.h_last_name,
       housewife.housewife_id,orders.customer_id,
       (select customer.first_name from customer where customer.customer_id in 
       (select orders.customer_id from orders where orders.housewife_id=housewife.housewife_id 
       && housewife.housewife_id=?)) as first_name,
       (select customer.last_name from customer where customer.customer_id in 
       (select orders.customer_id from orders where orders.housewife_id=housewife.housewife_id 
       && housewife.housewife_id=?)) as last_name,orders.order_status from orders,housewife 
       where orders.housewife_id=housewife.housewife_id && housewife.housewife_id=? order by orders.order_id desc`;
        db.query(sql, [hid, hid, hid], (err, rows) => {
            if (!err) {
                console.log(rows);
                res.render('hvieworders', { rows });
            } else {
                console.log(err);
            }
        })
    }
}

/*Accept order req*/
exports.acceptorder = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        let message = "Order Accepted";
        let id = req.params.id;
        db.query(`UPDATE orders set order_status = ? where order_id = ?`, [message, id], (err, rows) => {
            if (!err) {
                console.log(rows);
                res.redirect('/housewife/orders');
            }
        });
    }
}

/*Reject Order req*/
exports.rejectorder = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        let message = "Order Rejected";
        let id = req.params.id;
        db.query(`UPDATE orders set order_status = ? where order_id = ?`, [message, id], (err, rows) => {
            if (!err) {
                console.log(rows);
                res.redirect('/housewife/orders');
            }
        });
    }
}

/*delivered order req*/

exports.deliveredorder = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        let message = "Order Delivered";
        let id = req.params.id;
        db.query(`UPDATE orders set order_status = ? where order_id = ?`, [message, id], (err, rows) => {
            if (!err) {
                console.log(rows);
                res.redirect('/housewife/orders');
            }
        });
    }
}

exports.viewaccount = (req, res) => {
    if (process.env.HOUSEWIFE_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logintry', { message });
    } else {
        db.query('SELECT * from housewife where housewife_id =?', [process.env.HOUSEWIFE_ID],
            (err, rows) => {
                if (!err) {
                    res.render('account', { rows });
                } else {
                    console.log(err);
                }
            })
    }
}
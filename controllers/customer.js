const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { query } = require("express");
const { __express } = require("hbs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.viewitem = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        db.query('SELECT ITEM.item_id,ITEM.housewife_id,ITEM.item_name,ITEM.item_details,ITEM.item_image,ITEM.item_price,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name FROM ITEM join housewife ON ITEM.housewife_id = HOUSEWIFE.housewife_id', (error, rows) => {
            if (!error) {
                console.log("Showing items to user " + process.env.CUSTOMER_ID + " -> going to view items page")
                res.render('cviewitems', { rows });
            } else {
                console.log(error);
            }
        });
    }
}

exports.viewrecipe = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        db.query('SELECT recipe.R_id,recipe.housewife_id,recipe.Rname,recipe.Rdesc,recipe.RImage,recipe.Ingredients,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name FROM recipe join housewife ON recipe.housewife_id = HOUSEWIFE.housewife_id', (error, rows) => {
            if (!error) {
                console.log("Showing Recipes to user " + process.env.CUSTOMER_ID + " -> going to view recipes page")
                res.render('cviewrecipes', { rows });
            } else {
                console.log(error);
            }
        });
    }
}

exports.viewselecteditem = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        const id = req.params.id;
        db.query('SELECT ITEM.item_id,ITEM.housewife_id,ITEM.item_name,ITEM.item_details,ITEM.item_image,ITEM.item_price,housewife.housewife_id,housewife.h_first_name,housewife.h_last_name,housewife.h_address FROM ITEM join housewife ON ITEM.housewife_id = HOUSEWIFE.housewife_id && ITEM.housewife_id =?', [id], (error, rows) => {
            if (!error) {
                console.log("Showing items to user " + process.env.CUSTOMER_ID + " -> going to view items page")
                res.render('cselectitems', { rows });
            } else {
                console.log(error);
            }
        });
    }
}


//post req of add to cart
exports.addtocart = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        console.log("Inside the addtocart")
        const qty = req.body.quantity;
        const hid = req.params.hid;
        const iid = req.params.iid;
        let item_name, item_details, item_image, item_price, total_price;
        console.log("Quantity is : " + qty + " Housewife id : " + hid + " item id : " + iid);
        console.log("Going inide item query");
        /*Query to get the info for items*/
        db.query('SELECT ITEM.housewife_id,ITEM.item_name,ITEM.item_details,ITEM.item_image,ITEM.item_price from ITEM where item_id =?', [iid], (error, result) => {
            if (!error) {
                {
                    /*Fetching data from item with item id*/
                    console.log(result);
                    item_name = result[0].item_name;
                    item_image = result[0].item_image;
                    item_price = result[0].item_price;
                    item_details = result[0].item_details;
                    total_price = item_price * qty;
                    console.log("Going in set cart query");
                    /*Query to insert items in cart*/

                    db.query('INSERT INTO CART SET ?', {
                        item_id: iid,
                        customer_id: process.env.CUSTOMER_ID,
                        housewife_id: hid,
                        item_name: item_name,
                        item_details: item_details,
                        item_image: item_image,
                        item_price: item_price,
                        quantity: qty,
                        total_price: total_price
                    }, (err, row) => {
                        if (!err) {
                            /*Query to redirect to view page*/
                            console.log("Item added to cart");
                            res.redirect("/customer/cart");
                        } else {
                            console.log(err);
                        }
                    });
                }
            } else {
                console.log(error);
            }
        });
    }
}

//place order 
exports.placeorder = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        console.log("Inside Place Order");
        /*Query to get the items in the cart*/
        db.query(`Select CART.cart_id,CART.item_id,CART.item_name,CART.housewife_id,
                    CART.customer_id,CART.item_image,CART.item_details,CART.item_price,
                    CART.quantity,CART.total_price,housewife.h_first_name,housewife.h_address,
                    housewife.h_last_name from CART,housewife where customer_id=?
                    && CART.housewife_id=housewife.housewife_id && 
                    CART.housewife_id IN(Select CART.housewife_id from CART where 
                    CART.cart_id = (Select min(CART.cart_id) from CART))`, [process.env.CUSTOMER_ID], (er, rows) => {

            if (!er) {
                console.log("Fetched the cart items  : ");
                var total_price = 0;
                let order_details = "";
                let housewife_id = "";
                let quantity = 0;
                let status = "Order Placed";
                for (val in rows) {
                    // console.log(rows[val]);
                    total_price += rows[val].total_price;
                    order_details += rows[val].item_name + ",";
                    housewife_id = rows[val].housewife_id;
                    quantity += rows[val].quantity;
                }

                db.query('Insert into orders set ?', {
                    customer_id: process.env.CUSTOMER_ID,
                    housewife_id: housewife_id,
                    quantity: quantity,
                    order_details: order_details,
                    total_price: total_price,
                    order_status: status,
                    order_time: new Date()
                }, (error, result) => {
                    if (!error) {
                        console.log(result);
                        res.redirect('/customer/cart/empty');
                    } else {
                        console.log(error);
                    }
                });
                console.log("After the for each loop");
                console.log("Price : " + total_price + " Details : " + order_details + "Housewife id : " + housewife_id + " Quantity : " + quantity);
                // let { add } = rows[0].h_address;
                // res.render('customercart', { rows, add });
            } else {
                console.log(er);
            }
        });
    }
}

//go to cart 
exports.gotocart = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        console.log("Inside cart");
        let count = 0;
        db.query('select count(*) as c from CART', (err, result) => {
            if (!err) {
                console.log("Before result console");
                console.log(result);
                count = result[0].c;
                console.log("Count is : " + count);
                /*COMPLEX QUERY FOR CART BECAUSE CART ME SIRF 1 HI 
                HOUSEWIFE KA ITEMS ALLOWED HONA CHAIYE SO JO HOUSEWIFE NE SABSE
                1ST CART ME INSERT KIYA HOGA VOHI DIKHEGA CART ME*/
                if (count > 0) {
                    db.query(`Select CART.cart_id,CART.item_id,CART.item_name,CART.housewife_id,
                    CART.customer_id,CART.item_image,CART.item_details,CART.item_price,
                    CART.quantity,CART.total_price,housewife.h_first_name,housewife.h_address,
                    housewife.h_last_name from CART,housewife where customer_id=?
                    && CART.housewife_id=housewife.housewife_id && 
                    CART.housewife_id IN(Select CART.housewife_id from CART where 
                    CART.cart_id = (Select min(CART.cart_id) from CART))`, [process.env.CUSTOMER_ID], (er, rows) => {

                        if (!er) {
                            console.log("GOING to show items : ");
                            let { add } = rows[0].h_address;
                            res.render('customercart', { rows, add });
                        } else {
                            console.log(er);
                        }
                    });
                } else {
                    console.log("No items in cart");
                    let message = "The cart is empty, please add some items."
                    res.render('customercart', { message });
                }
            } else {
                console.log(err);
            }
        });

    }
}


//get req to delete one item from cart
exports.deleteoneitemfromcart = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        const cid = req.params['id'];
        db.query('DELETE FROM CART where cart_id = ?', [cid], (err, row) => {
            console.log(row);
            if (!err) {
                let count;
                db.query('select count(cart_id) as c from CART', (err, result) => {
                    if (!err) {
                        count = result[0].c;
                        if (count > 0) {
                            db.query(`Select CART.cart_id,CART.item_id,CART.item_name,CART.housewife_id,
                                CART.customer_id,CART.item_image,CART.item_details,CART.item_price,
                                CART.quantity,CART.total_price,housewife.h_first_name,housewife.h_address,
                                housewife.h_last_name from CART,housewife where customer_id=?
                                && CART.housewife_id=housewife.housewife_id && 
                                CART.housewife_id IN(Select CART.housewife_id from CART where 
                                CART.cart_id = (Select min(CART.cart_id) from CART))`, [process.env.CUSTOMER_ID], (er, rows) => {
                                if (!er) {
                                    console.log("GOING to show items : ");
                                    let { add } = rows[0].h_address;
                                    res.render('customercart', { rows });
                                } else {
                                    console.log(er);
                                }
                            });
                        } else {
                            let message = "The cart is empty, please add some items."
                            res.render('customercart', { message });
                        }
                    }
                });
            } else {
                console.log(err);
            }
        });
    }
}

//empty cart req
exports.emptycart = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        console.log("performing Empty cart operation for " + process.env.CUSTOMER_ID);
        db.query('DELETE FROM CART where customer_id = ?', [process.env.CUSTOMER_ID], (err, rows) => {
            if (!err) {
                console.log(rows);
                res.redirect("/customer/cart");
            } else {
                console.log(err);
            }
        });

    }
}

//customer myorders view req
exports.myorders = (req, res) => {
    // res.render('cmyorder');
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        console.log("Showing Orders of : " + process.env.CUSTOMER_ID);
        db.query(`SELECT orders.order_id,orders.order_details,orders.total_price,
        orders.quantity,orders.order_time,housewife.h_first_name,housewife.h_last_name,
        housewife.housewife_id,orders.customer_id,orders.order_status from orders,housewife 
        where orders.housewife_id=housewife.housewife_id && orders.customer_id = ? order by orders.order_id desc`, [process.env.CUSTOMER_ID],
            (err, rows) => {
                if (!err) {
                    console.log("Going to show orders : ");
                    res.render('cmyorder', { rows });
                } else {
                    console.log(err);
                }
            });
    }
}

//customer view account
exports.viewaccount = (req, res) => {
    if (process.env.CUSTOMER_ID == undefined) {
        const message = "Session expired please login again"
        res.render('logincustomer', { message });
    } else {
        db.query('SELECT * from customer where customer_id =?', [process.env.CUSTOMER_ID],
            (err, rows) => {
                if (!err) {
                    res.render('caccount', { rows });
                } else {
                    console.log(err);
                }
            })
    }
}
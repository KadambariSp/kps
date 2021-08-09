const express = require("express");
const router = express.Router();
const housewifeController = require("../controllers/housewife");
const customerController = require("../controllers/customer");


const { route } = require("./auth");


router.get('/', (req, res) => {
    res.render('index');
});


router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/HomePage', (req, res) => {
    res.render('HomePage');
});
router.get('/choicecards', (req, res) => {
    res.render('choicecards');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
router.get('/logintry', (req, res) => {
    res.render('logintry');
});
router.get('/registertry2', (req, res) => {
    res.render('registertry2');
});
router.get('/registercustomer', (req, res) => {
    res.render('registercustomer');
});
router.get('/logincustomer', (req, res) => {
    res.render('logincustomer');
});
router.get('/dashobarduser', (req, res) => {
    res.render('dashobarduser');
});

//get add product req
router.get('/housewife/addproduct', housewifeController.getaddproduct);

//view items in housewife
router.get('/housewife/viewitems', housewifeController.viewitems);


//view recipes in housewife
router.get('/housewife/viewrecipes', housewifeController.viewrecipes);


//post add product to insert in db
router.post('/insertproduct', housewifeController.insertproduct);


//post add recipe to insert in db
router.post('/insertrecipe', housewifeController.insertrecipe);


//delete items from housewife
router.get('/housewife/deleteitem/:id', housewifeController.deleteproduct);


//delete recipe from housewife
router.get('/housewife/deleterecipe/:id', housewifeController.deleterecipe);


//get customer view items req 
router.get('/customer/viewitem', customerController.viewitem);


//get customer view recipe req 
router.get('/customer/viewrecipe', customerController.viewrecipe);


//get customer select item view req
router.get('/customer/selected/:id', customerController.viewselecteditem);

//post add to cart
router.post('/customer/addtocart/:hid/:iid', customerController.addtocart);

//get cart view req
router.get('/customer/cart', customerController.gotocart);

//get delete item from cart req
router.get('/customer/cart/delete/:id', customerController.deleteoneitemfromcart);

//get empty cart req
router.get('/customer/cart/empty', customerController.emptycart);


//insert recipe
router.get('/insertrecipe/', housewifeController.insertrecipe);


//get add product req
router.get('/housewife/addrecipe', housewifeController.getaddrecipe);


//get place order req from customer
router.get('/customer/cart/order', customerController.placeorder);

//get customer my orders view request 
router.get('/customer/orders', customerController.myorders);


//get housewife view orders view req
router.get('/housewife/orders', housewifeController.vieworders);


/*Housewife Accept order for customer*/
router.get('/housewife/order/accept/:id', housewifeController.acceptorder);

/*Housewife Reject order for customer*/
router.get('/housewife/order/reject/:id', housewifeController.rejectorder);

/*Housewife Delivered order for customer*/
router.get('/housewife/order/delivered/:id', housewifeController.deliveredorder);


/*Housewife view profile account req*/
router.get('/housewife/account', housewifeController.viewaccount);

/*Customer view profile account req*/
router.get('/customer/account', customerController.viewaccount);
/*Export all the router objects*/
module.exports = router;
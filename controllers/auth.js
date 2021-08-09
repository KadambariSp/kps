const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});
exports.logintry = async(req, res) => {

    try {

        const { h_email, password } = req.body;

        if (!h_email || !password) {
            return res.status(400).render('logintry', {
                message: 'You need email and password.'
            })
        }

        db.query('SELECT * FROM housewife WHERE h_email = ?', [h_email], async(error, results) => {
            console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password)))
                res.status(401).render('logintry', {
                    message: 'The email or password is incorrect'
                })
            else {
                console.log("Successfully Logged In!!");
                /* res.render('login', {
                     message: 'You are Logged In successfully!!'
                 })*/
                process.env['HOUSEWIFE_ID'] = results[0].housewife_id;
                console.log(process.env.HOUSEWIFE_ID + " Logged in successfully");
                return res.render('dashboard')
            }
        })

    } catch (error) {
        console.log(error);
    }

}


exports.registertry2 = (req, res) => {
    console.log(req.body);

    const { h_first_name, h_middle_name, h_last_name, h_email, h_phone, h_address, h_city, h_pincode, password, passwordConfirm } = req.body;
    db.query('SELECT h_email FROM housewife WHERE h_email=?', [h_email], async(error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('registertry2', {
                message: 'That email has been already registered!'
            })
        } else if (password !== passwordConfirm) {
            return res.render('registertry2', {
                message: 'Passwords do not match!'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO housewife SET ?', {
            h_first_name: h_first_name,
            h_middle_name: h_middle_name,
            h_last_name: h_last_name,
            h_email: h_email,
            h_phone: h_phone,
            h_address: h_address,
            h_city: h_city,
            h_pincode: h_pincode,
            password: hashedPassword
        }, (error, results) => {
            if (error) { console.log(error); } else {
                console.log(results);
                return res.render('logintry')


            }
        });
    });
}
exports.registercustomer = (req, res) => {
    console.log(req.body);

    const {
        first_name,
        last_name,
        middle_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_pincode,
        password,
        passwordConfirm
    } = req.body;
    db.query('SELECT customer_email FROM customer WHERE customer_email=?', [customer_email],
        async(error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render('registercustomer', {
                    message: 'That email has been already registered!'
                })
            } else if (password !== passwordConfirm) {
                return res.render('registercustomer', {
                    message: 'Passwords do not match!'
                });
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            db.query('INSERT INTO customer SET ?', {
                    first_name: first_name,
                    last_name: last_name,
                    middle_name: middle_name,
                    customer_email: customer_email,
                    customer_phone: customer_phone,
                    customer_address: customer_address,
                    customer_city: customer_city,
                    customer_pincode: customer_pincode,
                    password: hashedPassword
                },
                (error, results) => {
                    if (error) { console.log(error); } else {
                        console.log(results);

                        return res.render('logincustomer')


                    }
                })
        });
}
exports.logincustomer = async(req, res) => {

    try {
        const { customer_email, password } = req.body;
        if (!customer_email || !password) {
            return res.status(400).render('logincustomer', {
                message: 'You need email and password.'
            })
        }
        db.query('SELECT * FROM customer WHERE customer_email = ?', [customer_email],
            async(error, results) => {
                console.log(results);
                if (!results || !(await bcrypt.compare(password, results[0].password)))
                    res.status(401).render('logincustomer', {
                        message: 'The email or password is incorrect'
                    })
                else {
                    process.env['CUSTOMER_ID'] = results[0].customer_id;
                    console.log(process.env.CUSTOMER_ID + " Logged in successfully");
                    /* res.render('login', {
                         message: 'You are Logged In successfully!!'
                     })*/
                    return res.render('dashobarduser')
                }
            })

    } catch (error) {
        console.log(error);
    }

}
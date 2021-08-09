const dotenv = require('dotenv');

dotenv.config({
    path: './.env'
});
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql");
const app = express();
const cookieParser = require("cookie-parser");



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(session({
    secret: 'anything',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');




db.connect((error) => {
        if (error) {
            console.log(error);
        } else {
            console.log("MYSQL CONNECTED SUCCESSFULLY!!")
        }

    })
    //define Routes

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));





app.listen(8002, () => {
    console.log("Server started on port 8002");
})
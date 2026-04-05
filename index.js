const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();
const path = require('path');

const flash = require('express-flash');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const seedAdmin = require("./seeds/admin.seed")

// ROUTES
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

const systemConfig = require('./config/system');

// DB
const database = require('./config/database');
database.connect();

// Models
const Cart = require("./models/cart.model");
const cartMiddleware = require("./middlewares/client/cart.middleware");

const app = express();
const port = process.env.PORT;

//cookies
app.use(cookieParser());

/* ======================================================
   MIDDLEWARE CƠ BẢN
====================================================== */
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// SESSION
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    })
);

// FLASH
app.use(flash());



/* ======================================================
   GẮN USER VÀO VIEW TEMPLATE
====================================================== */
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});



/* ======================================================
   MINI CART → LẤY TỪ MongoDB
====================================================== */
app.use(cartMiddleware.cartTotal);



/* ======================================================
   TEMPLATE, STATIC FILES, TINYMCE
====================================================== */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.locals.tinyMceKey = process.env.TINYMCE_API_KEY;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.locals.prefixAdmin = systemConfig.prefixAdmin;


// ROUTES CLIENT
routeClient(app);

// ROUTES ADMIN
routeAdmin(app);

app.use((req, res, next) => {
    res.status(404).render('client/pages/error/404', {
        pageTitle: "404 Not Found"
    });
});

seedAdmin()

/* ======================================================
   RUN SERVER
====================================================== */
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

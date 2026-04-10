const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();
const path = require('path');

const flash = require('express-flash');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const routeClient = require('../routes/client/index.route');
const routeAdmin = require('../routes/admin/index.route');
const systemConfig = require('../config/system');

const database = require('../config/database');

if (process.env.NODE_ENV !== 'test') {
    database.connect();
}

const Cart = require("../models/cart.model");
const cartMiddleware = require("../middlewares/client/cart.middleware");

const app = express();

app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'test-secret',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use(cartMiddleware.cartTotal);

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.locals.tinyMceKey = process.env.TINYMCE_API_KEY;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeClient(app);
routeAdmin(app);

app.use((req, res, next) => {
    res.status(404).render('client/pages/error/404', { pageTitle: "404 Not Found" });
});

const multer = require('multer');

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Invalid file type') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    next(err);
});

module.exports = app;
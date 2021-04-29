const config = require('config');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const contentSecurityPolicy = require("helmet-csp");
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { generateNonce, getDirectives } = require('./middleware/helmet');
const { error404Handler, variableLocal, errorHandler, CSPviolation } = require('./middleware/index');

// Intializations
const app = express();
require('dotenv').config();
require('./middleware/passport');

// Settings
app.set('views', path.join(__dirname, 'app/views'));
console.log(app.get('views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./middleware/handlebars')
}))
app.set('view engine', '.hbs');

//Middlewares
app.use(logger(config.get('logger'), { skip: function (req, res) { return res.statusCode < 400 } }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(generateNonce)
app.use(contentSecurityPolicy({ directives: getDirectives() }));
app.post(`/api/csp/report`, CSPviolation);

// Para Passport
app.use(session({
    secret: process.env.SECRET,
    name: 'sessionId',
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiración: 86400000,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(config.get('mysqldb'))
}));
app.use(passport.initialize());
app.use(passport.session());

// Publico
app.use('/scripts', express.static(path.join(__dirname, './node_modules')));
app.use('/views', express.static(path.join(__dirname, '/app/views')));
app.use(express.static(path.join(__dirname, '/app/public')));

//Rutas
app.use('/', require('./components/routes/index'));
app.use('/select2', require('./routes/select2'));
app.use('/imagenes', require('./routes/imagenes'));
app.use('/mantenedor', require('./components/routes/mantenedor'));


//Variables Globales
app.use(variableLocal);
app.use(error404Handler);
app.use(errorHandler);

module.exports = app;

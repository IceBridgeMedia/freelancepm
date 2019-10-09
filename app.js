const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded( { extended: true } ));
app.use(session({
    secret: "AJk1N!UJ@ne1",
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.use('/account', require('./routes/account'));
app.use('/paypal', require('./routes/paypal'));
app.use('/dashboard', isAuthenticated, require('./routes/dashboard'));
app.use('/projects', isAuthenticated, require('./routes/project'));
app.use('/clients', isAuthenticated, require('./routes/client'));


app.use('*', (req, res) => {
    console.log("404");
    res.redirect("/account/login");
});



const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log("Running on port:", port);
});

function isAuthenticated(req, res, next) {
    // do any checks you want to in here
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up

    if (req.session.logged_in)
        return next();
  
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/account/login');
}
const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models/sequelize');

var router = express.Router();

// logout methods
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.error(err);
    });
    res.redirect('/account/login');
})

// login methods
router.get('/login', (req, res) => {
    if (req.session.logged_in)
        return res.redirect('/dashboard');

    res.render("login", { layout: "account" });
});

router.post('/login', (req, res) => {
    
    if (req.session.logged_in)
        return res.redirect('/dashboard');

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        bcrypt.compare(password, user.password, (err, value) => {
            if(value == true) {

                // set session
                req.session.logged_in = true;
                req.session.user_name = user.username;
                req.session.user_email = user.email;

                res.redirect('/dashboard');
            }else{
                res.json("invalid");
            }
        });
    });
});

// register methods
router.get('/register', (req, res) => {
    if (req.session.logged_in)
        return res.redirect('/dashboard');

        
    res.render("register", { layout: "account" });
});

router.post('/register', (req, res) => {
    if (req.session.logged_in)
        return res.redirect('/dashboard');


    // username, password, email
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const hashedPassword = bcrypt.hashSync(password);

    User.create({
        username: username,
        password: hashedPassword,
        email: email
    });

    res.redirect('/account/login');
})

module.exports = router;
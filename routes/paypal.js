const express = require('express');
const request = require('request');
const { Payment } = require('../models/sequelize');
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);

    const body = req.body;

    const payment_date = req.body.payment_date;
    const payment_status = req.body.payment_status;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const payer_email = req.body.payer_email;
    const payment_amount = req.body.mc_gross;

    let postreq = 'cmd=_notify-validate';

    // Iterate the original request payload object
    // and prepend its keys and values to the post string
    Object.keys(body).map((key) => {
        postreq = `${postreq}&${key}=${body[key]}`;
        return key;
    });

    const options = {
        url: 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr',
        method: 'POST',
        headers: {
            'Content-Length': postreq.length,
        },
        encoding: 'utf-8',
        body: postreq
    };

    // Make a post request to PayPal
    request(options, (error, response, resBody) => {
        if (error || response.statusCode !== 200) {
            reject(new Error(error));
            return;
        }

        // Validate the response from PayPal and resolve / reject the promise.
        if (resBody.substring(0, 8) === 'VERIFIED') {
            console.log("verified");

            // let's add it to the database
            Payment.create({
                payment_date: payment_date,
                payment_status: payment_status,
                first_name: first_name,
                last_name: last_name,
                payer_email: payer_email,
                payment_amount: payment_amount
            });
        } else if (resBody.substring(0, 7) === 'INVALID') {
            console.log("Invalid");
        } else {
            console.log("Unexpected response body");
        }
    });

    res.status(200);
});

router.get('/', (req, res) => {
    res.json("test");
})


module.exports = router;
const express = require('express');
const { Client, Contact, Project, Note } = require('../models/sequelize');

const router = express.Router();

router.get('/', (req, res) => {
    Client.findAll({}).then((clients) => {
        res.render("client", { clients: clients });
    });
});

router.post('/', (req, res) => {
    const companyName = req.body.companyName;
    const clientName = req.body.clientName;
    const clientEmail = req.body.contactEmail;

    Contact.create({
        name: clientName,
        email: clientEmail,
        client: {
            name: companyName
        }
    },{
        include: [ Client ]
    });
    res.redirect('/clients');
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    Client.findAll({
        where: {
            id: id
        },
        include: [ Contact, Project, Note ]
    }).then((clientData) => {
        res.render('clientSingle', { clientData: clientData });
    });
});

router.post('/addNote', (req, res) => {
    const id = req.body.clientid;
    const description = req.body.description;

    Note.create({
        description: description,
        clientId: id
    });
    
    res.redirect('/clients/' + id);
});

module.exports = router;
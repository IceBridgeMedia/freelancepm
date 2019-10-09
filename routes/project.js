const express = require('express');
const { Client, Project, Task } = require('../models/sequelize');

const router = express.Router();

router.get('/', (req, res) => {
    Project.findAll({
        include: Client
    }).then((projects) => {
        Client.findAll({
            attributes: ['id', 'name']
        }).then((clientData) => {
            res.render("projects", { projects: projects, clients: clientData });
        });
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    Project.findAll({
        where: {
            id: id
        },
        include: [Task]
    }).then((projectData) => {
        res.render('projectSingle', { projectData: projectData })
    });
});

router.post('/addProject', (req, res) => {
    const clientid = req.body.clientid;
    const projectName = req.body.projectName;
    const projectDescription = req.body.projectDescription;
    const hourlyRate = req.body.hourlyRate;
    const fixedRate = req.body.fixedRate;

    Project.create({
        name: projectName,
        description: projectDescription,
        clientId: parseInt(clientid),
        hourlyRate: hourlyRate,
        fixedRate: fixedRate
    }).then((data) => {
        res.redirect('/projects/' + data.id);
    });
});

router.post('/addTask', (req, res) => {
    const projectId = req.body.projectId;
    const taskName = req.body.taskName;
    const taskDescription = req.body.taskDescription;

    Task.create({
        name: taskName,
        description: taskDescription,
        projectId: projectId
    });

    res.redirect('/projects/' + projectId);
});

router.get('/taskComplete/:id', (req, res) => {
    const id = req.params.id;

    Task.update({
        status: 'complete',
    },{
        where: { id: id }
    }).then((task) => {
        Task.findAll({
            where: {
                id: id,
            }
        }).then((resTask) => {
            res.redirect('/projects/' + resTask[0].projectId);
        });
    });
    
});

// TODO: add a safety to ensure a task isn't deleted by accident
router.get('/taskDelete/:id', (req, res) => {
    const id = req.params.id;

    Task.findAll({
        where: {
            id: id
        }
    }).then((resTask) => {
        Task.destroy({
            where: {
                id: id
            }
        });
        res.redirect('/projects/' + resTask[0].projectId);
    });
});

module.exports = router;
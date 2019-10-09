// define sequelize
const Sequelize = require('sequelize');

// define models
const UserModel = require('./user');
const ClientModel = require('./client');
const ProjectModel = require('./project');
const NoteModel = require('./note');
const TaskModel = require('./task');
const ContactModel = require('./contacts');
const PaymentModel = require('./payment');

// define connection to database
const sequelize = new Sequelize(process.env.DB_NAME || 'freelancepm', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// create models as objects
const User = UserModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);
const Project = ProjectModel(sequelize, Sequelize);
const Note = NoteModel(sequelize, Sequelize);
const Task = TaskModel(sequelize, Sequelize);
const Contact = ContactModel(sequelize, Sequelize);
const Payment = PaymentModel(sequelize, Sequelize);

// establish model relationshops
Project.belongsTo(Client);
Client.hasMany(Project);
Note.belongsTo(Client);
Client.hasMany(Note);
Task.belongsTo(Project);
Project.hasMany(Task)
Client.hasMany(Contact);
Contact.belongsTo(Client);



// tell sequelize to sync, creating tables || force: true will wipe all data
sequelize.sync({ force: false })
    .then(() => {
        console.log("Database & tables created.");
    });

// export models
module.exports = {
    User,
    Client,
    Project,
    Note,
    Task,
    Contact,
    Payment
}
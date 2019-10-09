module.exports = (sequelize, type) => {
    return sequelize.define('task', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        description: type.TEXT,
        status: type.STRING
    });
}
module.exports = (sequelize, type) => {
    return sequelize.define('project', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        description: {
            type: type.TEXT,
            allowNull: false
        },
        hourlyRate: type.FLOAT,
        fixedRate: type.FLOAT
    });
}
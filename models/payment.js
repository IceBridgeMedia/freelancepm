module.exports = (sequelize, type) => {
    return sequelize.define('payment', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        payment_date: type.STRING,
        payment_status: type.STRING,
        first_name: type.STRING,
        last_name: type.STRING,
        payer_email: type.STRING,
        payment_amount: type.FLOAT
    });
}
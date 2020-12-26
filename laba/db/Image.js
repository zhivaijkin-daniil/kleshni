const Sequilize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('answers',{
        id: {
            type: Sequilize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        answer: {
            type: Sequilize.STRING,
            allowNull: false
        },
        idq: {
            type: Sequilize.STRING,
            allowNull: false
        }
    }, {
       timestamps : false
    });
}
const Sequelize = require('sequelize');

const sequelize = new Sequelize('new_schema', 'root', 'Nikita1994Pavel2001', {
    dialect: "mysql",
    host: "localhost"
})

const Image = require('./Image')(sequelize);

module.exports = {
    sequelize: sequelize,
    image: Image
}

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('fitness_app', 'root', 'Password', {
    dialect: 'mysql',
    host: 'localhost', 
});

export default sequelize;
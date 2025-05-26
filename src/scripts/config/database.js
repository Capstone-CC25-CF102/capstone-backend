import { Sequelize } from "sequelize";

const db = new Sequelize('jelajah_jawa','root','root',{
    host: 'localhost',
    dialect: 'mysql',
});

export default db;
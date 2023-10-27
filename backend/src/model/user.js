import {Sequelize} from "sequelize";
import dotenv from "dotenv";

// Env variables.
// We import the .env file.
dotenv.config()
// We extract the env variables.
let user = process.env.POSTGRES_USER;
let password = process.env.POSTGRES_PASSWORD;
let port = process.env.POSTGRES_PORT
let db_name = process.env.POSTGRES_DB

// Initializing the sequelize model.
const sequelize = new Sequelize(db_name, user, password, {
    host: 'localhost',
    dialect: 'postgres',
    port: port,
});

export default sequelize
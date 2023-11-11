import {Sequelize} from "sequelize";
import dotenv from "dotenv";

// Env variables.
// We import the .env file.
dotenv.config()

// We extract the env variables.
let user = process.env.POSTGRES_USER;
let password = process.env.POSTGRES_PASSWORD;
let port = process.env.POSTGRES_PORT
let db_host = process.env.POSTGRES_HOST
let db_name = process.env.POSTGRES_DB

// Initializing the sequelize model.
const sequelize = new Sequelize(db_name, user, password, {
    host: db_host,              // Host to connect to.
    dialect: 'postgres',        // DB dialect. It is PostgreSQL.
    port: port,                 // Connexion port.
    freezeTableName: true,      // The name  of the model class will be the same as the table name.
    logging: false,             // We disable the logging of the application.
});

export default sequelize
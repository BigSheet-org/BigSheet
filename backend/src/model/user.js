import sequelize from "../tools/postgres.js";
import {DataTypes, Model} from "sequelize";

class User extends Model {

}

// -- Attribute definition in the SQL table -- //
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {sequelize}
)

export default User
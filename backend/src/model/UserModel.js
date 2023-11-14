import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";

class UserModel extends Model {

    /**
     * This method will search through the User table to fine a user matching the id provided.
     *
     * @param id Id to search for.
     * @returns {Promise<UserModel[] | null>} It returns null if no user were found. Returns the user otherwise.
     */
    static async getById(id) {
        let users = await UserModel.findAll({
            where: { id: id },
            attributes: {
                exclude: ['hash']
            },
        });
        users.length === 0 ? users = null : "";
        return users
    }
}

// -- Attribute definition in the SQL table -- //
UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
    }
)

export default UserModel
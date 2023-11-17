import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";

class UserModel extends Model {

    /**
     * This method will search through the User table to fine a user matching the id provided.
     *
     * @param id Id to search for.
     * @returns {Promise<UserModel>} It returns null if no user were found. Returns the user otherwise.
     */
    static async getById(id) {
        let users = await UserModel.findAll({
            where: { id: id },
            attributes: {
                exclude: ['hash']       // We don't return the hash of the user on the net !
            },
        });
        users.length === 0 ? users = null : users = users[0];
        return users;
    }

    /**
     * Returns the user corresponding to the login provided.
     * WARNING : This method also returns the hash of the user.
     * It should only be used by methods inside the server.
     *
     * @param login Login to find.
     * @returns {Promise<UserModel>} It returns null if no user were found. Returns the user otherwise.
     */
    static async getUserByLogin(login) {
        let users = await UserModel.findAll({
            where: { login: login },
        });
        users.length === 0 ? users = null : users = users[0];
        return users;
    }

    /**
     * Returns the user corresponding to the mail provided.
     *
     * @param mail Mail to find.
     * @returns {Promise<UserModel>} It returns null if no user were found. Returns the user otherwise.
     */
    static async getUserByMail(mail) {
        let users = await UserModel.findAll({
            where: { mail: mail },
        });
        users.length === 0 ? users = null : users = users[0];
        return users;
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
        tableName: 'User'
    }
);

export default UserModel
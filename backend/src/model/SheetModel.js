import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";
import UserModel from "./UserModel.js";

class SheetModel extends Model {

    /**
     * This method return all sheets owned by the user.
     *
     * @param userId Id of the user
     * @returns {Promise<SheetModel[]>} Return sheets
     */
    static async getAllByOwner(userId) {
        return await SheetModel.findAll({
            attributes: ['title', 'createdAt'], // get title and creation date
            include: { // we include UserModel to do inner join
                model: UserModel,
                as: 'users',
                attributes: [], // but we do not want Users who have access on sheet
                through: {
                    where: {
                        accessRight: 'owner'
                    }
                },
                where: {
                    id: userId,
                }
            }
        });
    }

    /**
     * This method return all sheets owned by the user.
     *
     * @param userId Id of the user
     * @returns {Promise<SheetModel[]>} Return sheets
     */
    static async getAccessibleByUser(userId) {
        return await SheetModel.findAll({
            attributes: ['title', 'createdAt'], // get title and creation date
            include: { // we include UserModel to do inner join
                model: UserModel,
                as: 'users',
                attributes: [], // but we not want Users who have access on sheet
                where: {
                    id: userId,
                }
            }
        });
    }

    /**
     * This method return sheet with the good id.
     *
     * @param userID Id to search for.
     * @returns {Promise<SheetModel>} Return sheet or null if not exist
     */
    static async getById(id) {
        return await SheetModel.findByPk(id, {
            include: {
                model: UserModel,
                as: 'users',
                attributes: ['id'],
                through: {
                    attributes: ['accessRight']
                }
            }
        });
    }
}

// -- Attribute definition in the SQL table -- //
SheetModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Sans-Nom'
        }
    },
    {
        sequelize,
        tableName: 'Sheet'
    }
);

export default SheetModel;
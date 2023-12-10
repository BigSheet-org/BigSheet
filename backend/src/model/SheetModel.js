import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model, Op} from "sequelize";
import UserModel from "./UserModel.js";
import Data from "../common/data/Data.js";

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
                        accessRight: Data.SERVER_COMPARISON_DATA.PERMISSIONS.OWNER
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
            attributes: ['sheetID', 'title', 'createdAt'], // get title and creation date
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
     * This method returns the sheets that can be accessed by the user, but that are not owned by him.
     *
     * @param userID Id to search for.
     * @returns {Promise<SheetModel[]>} Return sheet or null if not exist
     */
    static async getSharedToUser(userID) {
        return await SheetModel.findAll({
            attributes: ['id', 'title', 'createdAt'],   // Get title and creation date
            include: {                                  // We include UserModel to do inner join
                model: UserModel,
                as: 'users',
                attributes: [],                         // But we do not want Users who have access on sheet
                through: {
                    where: {
                        [Op.or]: [
                            {accessRight: Data.SERVER_COMPARISON_DATA.PERMISSIONS.READ},
                            {accessRight: Data.SERVER_COMPARISON_DATA.PERMISSIONS.WRITE}
                        ]
                    }
                },
                where: { id: userID }
            }
        });
    }

    /**
     * This method return sheet with the good id.
     *
     * @param id Id to search for.
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
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize,
        tableName: 'Sheet'
    }
);

export default SheetModel;
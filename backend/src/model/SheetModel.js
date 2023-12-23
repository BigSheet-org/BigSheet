import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model, Op, Sequelize} from "sequelize";
import UserModel from "./UserModel.js";
import Data from "../common/data/Data.js";
import { UserAccessSheet } from "../association/UserAccessSheet.js";

class SheetModel extends Model {

    /**
     * This method return all sheets owned by the user.
     *
     * @param userId Id of the user
     * @returns {Promise<SheetModel[]>} Return sheets
     */
    static async getAllByOwner(userId) {
        return await SheetModel.findAll({
            attributes: ['id', 'title', 'detail', 'createdAt'], // get title and creation date
            include: { // we include UserModel to do inner join
                model: UserModel,
                as: 'users',
                attributes: ['id', 'login'], 
                through: {
                    attributes: [], // we don't want attributes in UserAccessSheet
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
            attributes: ['id', 'title', 'detail', 'createdAt'], // get title and creation date
            include: { // we include UserModel to do inner join
                model: UserModel,
                as: 'users',
                attributes: ['id', 'login'], 
                where: { 
                    [Op.or]: [
                        { id: userId },
                        { id: {
                            [Op.eq]: sequelize.col('users->UserAccessSheet.userId')
                         } }
                    ]
                },
                through: {
                    attributes: [], // we don't want attributes in UserAccessSheet
                    where: {
                        accessRight: Data.SERVER_COMPARISON_DATA.PERMISSIONS.OWNER,
                        sheetId: {  // we search only good sheetId
                            [Op.eq]: sequelize.col('users->UserAccessSheet.sheetId')
                        }
                    }
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
    static async getSharedToUser(userId) {
        let owned = await SheetModel.getAllByOwner(userId);
        let all = await SheetModel.getAccessibleByUser(userId);
        let ownedId = owned.map(sheet => sheet.id);
        return all.filter(sheet => !ownedId.includes(sheet.id));
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
import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";
import UserModel from "./UserModel.js";

class SheetModel extends Model {
    /**
     * This method return all sheets owned by the user. 
     * @param userId Id off the user
     * @returns {Promise<SheetModel>} Return sheets
     */
    static async getAllSheetsByOwner(userId) {
        let user = await UserModel.findByPk(userId, {
            include: 'owned'
        });
        let sheets = user.getOwned();
        return sheets
    }

    /**
     * This method return sheet with the good id.
     * @param id Id to search for
     * @returns {Promise<SheetModel>} Return sheet or null if not exist
     */
    static async getById(id) {
        let sheet = await SheetModel.findByPk(id);
        return sheet;
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
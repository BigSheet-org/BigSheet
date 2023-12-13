import UserModel from "../model/UserModel.js";
import SheetModel from "../model/SheetModel.js";

import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";
import Data from "../common/data/Data.js";

export class UserAccessSheet extends Model {
    static async getAccessByPk(userId, sheetId) {
        return await UserAccessSheet.findOne({
            attributes: ['accessRight'],
            where: {
                userId: userId,
                sheetId: sheetId
            }
        });
    }
}

UserAccessSheet.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        sheetId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: SheetModel,
                key: 'id'
            }
        },
        accessRight: {
            type: DataTypes.ENUM(
                Data.SERVER_COMPARISON_DATA.PERMISSIONS.OWNER,
                Data.SERVER_COMPARISON_DATA.PERMISSIONS.READ,
                Data.SERVER_COMPARISON_DATA.PERMISSIONS.WRITE
            ),
            allowNull: false,
            defaultValue: Data.SERVER_COMPARISON_DATA.PERMISSIONS.OWNER
        }
    },
    {
        sequelize,
        tableName: 'UserAccessSheet'
    }
);


/**
 * Function to load association Access between User and Sheet.
 * Must be executed after the model's initialization.
 * Uses UserAccesSheet table to associate User and Sheet models.
 * Relation Many-to-Many.
 */
export const initRelations = async () => {
    UserModel.belongsToMany(SheetModel, { 
        through: UserAccessSheet,
        foreignKey: 'userId',
        as: 'sheets'
     });
    SheetModel.belongsToMany(UserModel, {
        through: UserAccessSheet,
        foreignKey: 'sheetId',
        as: 'users'
    });
};
import UserModel from "../model/UserModel.js";
import SheetModel from "../model/SheetModel.js";

import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";

class UserAccesSheet extends Model {}

UserAccesSheet.init(
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
            type: DataTypes.ENUM('owner', 'reader', 'write'),
            allowNull: false,
            defaultValue: 'owner'
        }
    },
    {
        sequelize,
        tableName: 'UserAccessSheet',
        modelName: 'userAccessSheet'
    }
);


/**
 * Function to load association Access between User and Sheet.
 * Must be executed after models initialization.
 * Use UserAccesSheet table to associate User and Sheet models.
 * Relation Manu-to-Many.
 */
export default async function() {
    UserModel.belongsToMany(SheetModel, { 
        through: UserAccesSheet, 
        foreignKey: 'userId',
        as: 'sheets'
     });
    SheetModel.belongsToMany(UserModel, {
        through: UserAccesSheet, 
        foreignKey: 'sheetId',
        as: 'users'
    });
};
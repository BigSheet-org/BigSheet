import UserModel from "../model/UserModel.js";
import SheetModel from "../model/SheetModel.js";

import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";

class UserAccessSheet extends Model {}

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
            type: DataTypes.ENUM('owner', 'reader', 'writer'),
            allowNull: false,
            defaultValue: 'owner'
        }
    },
    {
        sequelize,
        tableName: 'UserAccessSheet',
        modelName: 'UserAccessSheet'
    }
);


/**
 * Function to load association Access between User and Sheet.
 * Must be executed after the model's initialization.
 * Uses UserAccesSheet table to associate User and Sheet models.
 * Relation Many-to-Many.
 */
export const relations = async () => {
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
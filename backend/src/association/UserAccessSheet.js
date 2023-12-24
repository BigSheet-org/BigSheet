import UserModel from "../model/UserModel.js";
import SheetModel from "../model/SheetModel.js";

import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";
import Data from "../common/data/Data.js";
import { CellModel } from "./CellModel.js";

export class UserAccessSheet extends Model {
    static async getAccessByPk(userId, sheetId) {
        return await UserAccessSheet.findOne({
            attributes: ['accessRight'],
            where: {
                userId: userId,
                sheetId: sheetId
            },
            include: [
                {
                    model: UserModel,
                    as: 'user',
                    attributes:  ['login']
                },
                {
                    model: SheetModel,
                    as: 'sheet',
                    attributes:  ['title', 'detail'],
                    include: {
                        model: CellModel,
                        as: 'cells',
                        attributes: ['line', 'column', 'content']
                    }
                }
            ]
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
 * See Super Many-to-Many relationship in sequelize guide
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
    UserAccessSheet.belongsTo(UserModel, {
        foreignKey: 'userId',
        as: 'user'
    });
    UserAccessSheet.belongsTo(SheetModel, {
        foreignKey: 'sheetId',
        as: 'sheet'
    });
    UserModel.hasMany(UserAccessSheet, {
        foreignKey: 'userId'
    });
    SheetModel.hasMany(UserAccessSheet, {
        foreignKey: 'sheetId'
    });
};
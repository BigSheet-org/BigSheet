import SheetModel from "../model/SheetModel.js";
import UserModel from "../model/UserModel.js";
import sequelize from "../common/tools/postgres.js";
import {DataTypes} from "sequelize";


async function defineCollaboratorsAssociationTable() {
    await sequelize.define('SheetPermission', {
        userID: {
            type: DataTypes.INTEGER,
            references: {
                model: UserModel,
                key: 'id'
            }
        },
        sheetID: {
            type: DataTypes.INTEGER,
            references: {
                model: SheetModel,
                key: 'id'
            }
        },
        permission: {
            type: DataTypes.ENUM('reader', 'writer'),
            allowNull: false,
            defaultValue: 'reader'
        }
    }).sync();
}

export const syncAssociations =  async () => {
    // -- Owner associations -- //
    // Sheets have only one owner.
    UserModel.hasOne(SheetModel, {
        onDelete: 'CASCADE',
        foreignKey: 'ownerID'
    });
    SheetModel.belongsTo(UserModel, {
        foreignKey: 'ownerID'
    });

    // -- Contributors associations -- //
    // Sheets can have multiple collaborators.
    await defineCollaboratorsAssociationTable();
    UserModel.belongsToMany(SheetModel, { through: 'SheetPermission' });
    SheetModel.belongsToMany(UserModel, { through: 'SheetPermission' });

    await UserModel.sync({ alter: true });
    await SheetModel.sync({ alter: true });
}
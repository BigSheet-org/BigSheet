import sequelize from "../common/tools/postgres.js";
import {DataTypes, Model} from "sequelize";
import SheetModel from "../model/SheetModel.js";

export class CellModel extends Model {
    static async getOrBuilt(sheetId, line, column) {
        const [cell, built] = await CellModel.findOrBuild({
            where: {
                sheetId: sheetId,
                line: line,
                column: column
            }
        });
        return cell;        
    }

}

// -- Attribute definition in the SQL table -- //
CellModel.init(
    {
        sheetId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: SheetModel,
                key: 'id'
            }
        },
        line: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        column: {
            type: DataTypes.STRING,
            // only uppercase characters
            validate: {
                is: ["^[A-Z]+$", 'i']
            },
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false // if cell is empty, remove in database
        }
    },
    {
        sequelize,
        tableName: 'Cell'
    }
);

/**
 * Function to load association between Cell and Sheet.
 * Must be executed after SheetModel's initialization.
 * Relation One-to-Many.
 */
export const initRelations = async () => {
    SheetModel.hasOne(CellModel, {
        foreignKey: 'sheetId'
     });
    CellModel.belongsTo(SheetModel, {
        foreignKey: 'sheetId'
     });
};
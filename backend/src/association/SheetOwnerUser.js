import UserModel from "../model/UserModel.js";
import SheetModel from "../model/SheetModel.js";

/**
 * Function to load association Owner between User and Sheet.
 * Must be executed after models initialization.
 * This function is equivalent of add a foreign key in database but conserve principles of ORM.
 * Sheet has foreign key "ownerId" reference to "id" in User table.
 * Relation Once-to-Many.
 */
export default async function() {
    UserModel.hasMany(SheetModel, {
        as: 'owned',
        foreignKey: 'ownerId'
    });
    SheetModel.belongsTo(UserModel, {
        as: 'owner',
        foreignKey: 'ownerId'
    });
};
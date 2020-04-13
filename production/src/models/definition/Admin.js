"use strict";
const Sequelize = require("sequelize");
const { PROTECTED_FIELDS } = require("./../../misc/app.variables");
const Model = Sequelize.Model;
class Admin extends Model {
    toJSON() {
        // To hide protected fields such as password.. we do not want to return that to a user when he logs in
        let attributes = Object.assign({}, this.get());
        for (let a of PROTECTED_FIELDS) {
            delete attributes[a];
        }
        return attributes;
    }
}
Admin.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
    },
    username: {
        type: Sequelize.STRING(),
        allowNull: true,
        unique: true,
    },
    email: {
        type: Sequelize.STRING(),
        allowNull: true,
        unique: true,
    },
    dob: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    gender: {
        type: Sequelize.ENUM(["male", "female"]),
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING(),
        allowNull: true,
    },
    type: {
        type: Sequelize.ENUM(["admin", "super"]),
        allowNull: false
    },
    lastLoginAt: Sequelize.DATE,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {
    sequelize,
    modelName: "admins",
});
module.exports = Admin;

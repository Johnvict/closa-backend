"use strict";
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
class User extends Model {
}
User.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    agent_id: {
        type: Sequelize.INTEGER(11),
        references: {
            model: "agents",
            key: "id"
        }
    },
    avatar: {
        type: Sequelize.STRING(),
        defaultValue: "avatar.jpg"
    },
    name: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    occupation: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize,
    modelName: "users"
});
module.exports = User;

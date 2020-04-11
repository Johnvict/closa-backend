"use strict";
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
class Token extends Model {
}
Token.init({
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
    token: {
        type: Sequelize.STRING(6),
        allowNull: false
    },
    expireAt: Sequelize.DATE,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize,
    modelName: "tokens"
});
module.exports = Token;

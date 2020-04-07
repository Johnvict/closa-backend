"use strict";
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
class SearchHistory extends Model {
}
SearchHistory.init({
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
    key: {
        type: Sequelize.STRING(30),
        allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize,
    modelName: "search_histories"
});
module.exports = SearchHistory;

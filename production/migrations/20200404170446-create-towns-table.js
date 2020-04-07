"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("towns", {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            state_id: {
                type: Sequelize.INTEGER(11),
                references: {
                    model: "states",
                    key: "id"
                }
            },
            name: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("towns");
    }
};

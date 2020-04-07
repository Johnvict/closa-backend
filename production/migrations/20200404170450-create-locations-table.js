"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("locations", {
            id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoIncrement: true
            },
            agent_id: {
                type: Sequelize.INTEGER(11),
                references: {
                    model: "agents",
                    key: "id"
                }
            },
            long: Sequelize.STRING(10),
            lat: Sequelize.STRING(10),
            name: Sequelize.STRING(100),
            image: Sequelize.STRING(),
            state_id: {
                type: Sequelize.INTEGER(11),
                references: {
                    model: "states",
                    key: "id"
                }
            },
            town_id: {
                type: Sequelize.INTEGER(11),
                references: {
                    model: "towns",
                    key: "id"
                }
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("locations");
    }
};

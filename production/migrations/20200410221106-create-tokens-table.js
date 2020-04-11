'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tokens', {
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
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('tokens');
    }
};

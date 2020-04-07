"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("job_samples", {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            worker_id: {
                type: Sequelize.INTEGER(11),
                references: {
                    model: "workers",
                    key: "id"
                }
            },
            date_done: Sequelize.DATE,
            title: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("job_samples");
    }
};

"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("workers", {
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
      job: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      business_name: {
        type: Sequelize.STRING(150)
      },
      opening_time: {
        type: Sequelize.STRING(100)
      },
      closing_time: {
        type: Sequelize.STRING(100)
      },
      working_days: {
        type: Sequelize.STRING(100)
      },
      business_logo: {
        type: Sequelize.STRING(),
        allowNull: true
      },
      status: {
        type: Sequelize.Sequelize.ENUM(["available", "away"]),
        defaultValue: "away"
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("workers");
  }
};

"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("search_histories", {
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("search_histories");
  }
};

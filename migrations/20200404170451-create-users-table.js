"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
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
		defaultValue: "img/avatar/avatar.jpg"
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};

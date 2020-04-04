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
      phone: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(),
        allowNull: false,
	  },
	  type: {
		type: Sequelize.STRING(20),
		defaultValue: 'user'
	  },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      lastLoginAt: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};

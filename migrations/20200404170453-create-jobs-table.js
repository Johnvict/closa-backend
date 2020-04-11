"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("jobs", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      worker_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "agents",
          key: "id"
        }
      },
      user_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "agents",
          key: "id"
        }
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      start: Sequelize.DATE,
      est_delivery: Sequelize.DATE,
      delivery: Sequelize.DATE,
      rating: Sequelize.ENUM(["1", "2", "3", "4", "5"]),
      feedback: {
        type: Sequelize.STRING(50)
      },
      amount: {
        type: Sequelize.FLOAT()
      },
      proposed_amount: {
        type: Sequelize.FLOAT()
      },
      status: {
        type: Sequelize.ENUM([
          "cancelled",
          "pending",
          "doing",
          "done_pending",
          "done"
        ]),
        defaultValue: "pending"
      },
      cancelled_by: {
        type: Sequelize.ENUM(["worker", "user"]),
        allowNull: true
      },
      cancelled_reason: {
        type: Sequelize.ENUM(["price", "trust", "imcapability", "self"]),
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
	  return queryInterface.dropTable('jobs');
  }
};

const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Job extends Model {
	// We wish to return the rating as number instead of string
  toJSON() {
    let attributes = Object.assign({}, this.get());
	if (attributes['rating']) attributes['rating'] *= 1
    return attributes;
  }
}
Job.init(
  {
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
        "canceled",
        "pending",
        "doing",
        "done_pending",
        "done"
      ]),
      defaultValue: "pending"
    },
    canceled_by: {
      type: Sequelize.ENUM(["worker", "user"]),
      allowNull: true
    },
    canceled_reason: {
      type: Sequelize.ENUM(["price", "trust", "imcapability", "self"]),
      allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "jobs"
  }
);

module.exports = Job;

const Sequelize = require("sequelize");
const { PROTECTED_FIELDS } = require("./../../misc/app.variables");
const Model = Sequelize.Model;

class Agent extends Model {
  toJSON() {
    // To hide protected fields such as password.. we do not want to return that to a user when he logs in
    let attributes = Object.assign({}, this.get());
    for (let a of PROTECTED_FIELDS) {
      delete attributes[a];
    }
    return attributes;
  }
}
Agent.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(),
      allowNull: false
    },
    type: {
	  type: Sequelize.ENUM(['user', 'worker']),
      defaultValue: 'user'
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
	},
    lastLoginAt: Sequelize.DATE,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "agents"
  }
);

module.exports = Agent;

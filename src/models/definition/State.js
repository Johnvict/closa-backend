const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class State extends Model {
  // The below code must be left here because it allows the type conversion done in Town.js
  toJSON() {
    let attributes = Object.assign({}, this.get());
    return attributes
  }
}
State.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "states"
  }
);

module.exports = State;

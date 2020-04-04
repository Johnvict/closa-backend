const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Town extends Model { }
Town.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
	state_id: {
	  type: Sequelize.INTEGER(11),
	  references: {
		model: "states",
		key: "id"
	  }
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
    modelName: "towns"
  }
);

module.exports = Town;

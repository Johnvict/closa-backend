const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Town extends Model {
	toJSON() {
		let attributes = Object.assign({}, this.get());
		if (attributes["lat"]) attributes["lat"] = Number(attributes["lat"]);
		if (attributes["long"]) attributes["long"] = Number(attributes["long"]);
		return attributes;
	  }
}
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
	long: Sequelize.STRING(10),
	lat: Sequelize.STRING(10),
	createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "towns"
  }
);

module.exports = Town;

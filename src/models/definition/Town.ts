import { sequelize } from "./../../../models/index";
import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
  } from "sequelize";


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
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
	state_id: {
	  type: DataTypes.INTEGER.UNSIGNED,
	  references: {
		model: "states",
		key: "id"
	  }
	},
	name: {
		type: DataTypes.STRING(30),
		allowNull: false
	},
	long: DataTypes.STRING(10),
	lat: DataTypes.STRING(10),
	createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: "towns",
    tableName: "towns"
  }
);

module.exports = Town;

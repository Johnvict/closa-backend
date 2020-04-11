const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Worker extends Model {
  toJSON() {
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	let attributes = Object.assign({}, this.get());
	if (attributes["working_days"]) attributes["working_days"] = attributes["working_days"]
	.split(',')
	.sort()
	.filter(d => d < 7 && d >= 0 )
	.map(eachNum => {
		return days[eachNum*1]
	});
    return attributes;
  }
}
Worker.init(
  {
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
    job: {
      type: Sequelize.STRING(80),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(50)
    },
    opening_time: {
      type: Sequelize.STRING(6)
    },
    closing_time: {
      type: Sequelize.STRING(6)
    },
    working_days: {
      type: Sequelize.STRING(15)
    },
    logo: {
      type: Sequelize.STRING(),
      defaultValue: 'logo.jpg'
    },
    status: {
      type: Sequelize.Sequelize.ENUM(["available", "away"]),
      defaultValue: "away"
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "workers"
  }
);

module.exports = Worker;

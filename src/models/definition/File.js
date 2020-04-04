const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class File extends Model { }
File.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
	job_sample_id: {
	  type: Sequelize.INTEGER(11),
	  references: {
		model: "job_samples",
		key: "id"
	  }
	},
	name: {
	  type: Sequelize.STRING(30),
	  allowNull: false
	},
	type: Sequelize.ENUM(['audio', 'video', 'image', 'pdf', 'link']),
	url: Sequelize.STRING,
	createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "files"
  }
);

module.exports = File;

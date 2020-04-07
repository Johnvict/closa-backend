"use strict";
const Sequelize = require("sequelize");
const Model = Sequelize.Model;
class JobSample extends Model {
}
JobSample.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    worker_id: {
        type: Sequelize.INTEGER(11),
        references: {
            model: "workers",
            key: "id"
        }
    },
    date_done: Sequelize.DATE,
    title: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize,
    modelName: "job_samples"
});
module.exports = JobSample;

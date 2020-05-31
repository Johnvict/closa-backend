"use strict";
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
        if (attributes["worker_jobs"]) {
            const total_rating_points = attributes["worker_jobs"].reduce((sum, val) => ((Number(val.rating) > 0 ? Number(val.rating) : 0) + sum), 0);
            const total_rating_available = attributes["worker_jobs"].filter(val => val.rating > 0).length;
            const total_obtainable_rating = total_rating_available * 5;
            const average_raiting_obtained = total_obtainable_rating == 0 ? 0 : (total_rating_points / total_obtainable_rating) * 5;
            attributes['rating'] = { total: total_rating_available, average: Number(average_raiting_obtained.toFixed(2)) };
            console.table({
                TotalRatingTimes: total_rating_available,
                TotalRatingObtainable: total_obtainable_rating,
                TotalRatingPoints: total_rating_points,
                NoOfJobsWithDot: attributes.worker_jobs.length,
                NoOfJobs: attributes["worker_jobs"].length
            });
        }
        return attributes;
    }
}
Agent.init({
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
    },
    username: {
        type: Sequelize.STRING(),
        allowNull: true,
        unique: true,
    },
    email: {
        type: Sequelize.STRING(),
        allowNull: true,
        unique: true,
    },
    dob: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    gender: {
        type: Sequelize.ENUM(["male", "female"]),
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING(),
        allowNull: true,
    },
    type: {
        type: Sequelize.ENUM(["user", "worker"]),
        defaultValue: "user",
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    lastLoginAt: Sequelize.DATE,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {
    sequelize,
    modelName: "agents",
});
module.exports = Agent;

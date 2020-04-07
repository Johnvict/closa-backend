"use strict";
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
class Location extends Model {
}
Location.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    agent_id: {
        type: Sequelize.INTEGER(11),
        references: {
            model: "agents",
            key: "id"
        }
    },
    long: Sequelize.STRING(10),
    lat: Sequelize.STRING(10),
    name: Sequelize.STRING(100),
    image: Sequelize.STRING(),
    state_id: {
        type: Sequelize.INTEGER(11),
        references: {
            model: "states",
            key: "id"
        }
    },
    town_id: {
        type: Sequelize.INTEGER(11),
        references: {
            model: "towns",
            key: "id"
        }
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize,
    modelName: "locations"
});
module.exports = Location;

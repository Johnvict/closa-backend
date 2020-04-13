'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('admins', {
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
                type: Sequelize.ENUM(["admin", "super"]),
                allowNull: false
            },
            lastLoginAt: Sequelize.DATE,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('admins');
    }
};

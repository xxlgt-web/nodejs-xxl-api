'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sex: {
                type: Sequelize.TINYINT,
                allowNull: false,
                defaultValue: 9
            },
            company: {
                type: Sequelize.STRING
            },
            introduce: {
                type: Sequelize.TEXT
            },
            role: {
                type: Sequelize.TINYINT,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addIndex("Users", {
            fields: ["email"], // 要索引的字段
            unique: true // 唯一索引
        })
        await queryInterface.addIndex("Users", {
            fields: ["username"], // 要索引的字段
            unique: true // 唯一索引
        })
        await queryInterface.addIndex("Users", {
            fields: ["role"], // 要索引的字段
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};
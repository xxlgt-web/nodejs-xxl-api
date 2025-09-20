'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Chapters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED
            },
            courseId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT
            },
            video: {
                type: Sequelize.STRING
            },
            rank: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1
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

        await queryInterface.addIndex("Chapters", {
            fields: ["courseId"], // 要索引的字段
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Chapters');
    }
};
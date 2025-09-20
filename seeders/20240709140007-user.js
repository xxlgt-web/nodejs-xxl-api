'use strict';

const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        await queryInterface.bulkInsert("Users", [
            {
                email: "admin@xxl.cn",
                username: "admin",
                password: bcrypt.hashSync("123456", 10),
                nickname: "超级管理员",
                sex: 2,
                role: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "user1@xxl.cn",
                username: "user1",
                password: bcrypt.hashSync("123456", 10),
                nickname: "普通用户1",
                sex: 1,
                role: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "user2@xxl.cn",
                username: "user2",
                password: bcrypt.hashSync("123456", 10),
                nickname: "普通用户2",
                sex: 2,
                role: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                email: "user3@xxl.cn",
                username: "user3",
                password: bcrypt.hashSync("123456", 10),
                nickname: "普通用户3",
                sex: 2,
                role: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Users', null, {});
    }
};

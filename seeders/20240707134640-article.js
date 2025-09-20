'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    // 填充数据
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

        const articles = []
        const count = 100

        for (let i = 0; i < count; i++) {
            const article = {
                title: `文章的标题${i}`,
                content: `文章的内容${i}`,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            articles.push(article)
        }

        await queryInterface.bulkInsert('Articles', articles, {});

    },


    // 删除数据
    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('Articles', null, {});
    }
};

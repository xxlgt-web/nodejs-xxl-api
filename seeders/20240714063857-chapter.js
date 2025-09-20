'use strict';

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
        await queryInterface.bulkInsert("Chapters", [
            {
                courseId: 1,
                title: "CSS 课程介绍",
                content: "CSS (Cascading Style Sheets，层叠样式表），是一种用来为结构化文档（如 HTML 文档或 XML 应用）添加样式（字体、间距和颜色等）的计算机语言，CSS 文件扩展名为 .css。",
                video: "",
                rank: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseId: 2,
                title: "Node.js 课程介绍",
                content: "这套课程是定位是JS来全栈开发项目。让我们一起从零基础开始。学习接口开发，先从最基础的项目搭建、数据库的入门，再到完整的真实仙姑开发，一步步地学习Node.js。",
                video: "",
                rank: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseId: 2,
                title: "CSS 课程介绍",
                content: "安装Node.js，最简单的方式就是直接在官网进行下载。当项目是不同的Node版本的时候，就需要使用不同的版本进行开发，这个时候我们就可以采用nvm来进行Node版本管理，方便不同Node版本的项目开发，让我们来了解Node以及nvm的使用吧。",
                video: "",
                rank: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Chapters", null, {})
    }
};

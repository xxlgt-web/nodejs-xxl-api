const express = require('express');
const router = express.Router(); // 定义路由
const {Chapter, Course, User} = require("../models")
const {failure, success} = require("../utils/responses");
const {NotFoundError} = require("../utils/errors");
const {Op} = require("sequelize");

/**
 * 搜索
 * GET /search/?name={name}
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        const condition = {
            attributes: {
                exclude: ["CategoryId", "UserId", "content"]
            },
            order: [['id', "DESC"]],
            limit: pageSize,
            offset,
            where: {}
        }

        if (query.name) {
            condition.where["name"] = {
                [Op.like]: `%${query.name}%`
            }
        }

        const {count, rows} = await Course.findAndCountAll(condition)

        success(res, "查询成功。", {
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        })
    } catch (error) {
        failure(res, error)
    }
})


module.exports = router;

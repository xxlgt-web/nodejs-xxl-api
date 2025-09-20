const express = require('express');
const router = express.Router(); // 定义路由
const {Article} = require("../models")
const {failure, success} = require("../utils/responses");
const {NotFoundError} = require("../utils/errors");

/**
 * 查询文章
 * GET /articles
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        const condition = {
            attributes: {exclude: ["content"]},
            order: [["id", "DESC"]],
            limit: pageSize,
            offset
        }

        const {count, rows} = await Article.findAndCountAll(condition)

        success(res, "查询成功。", {
            articles: rows,
            pagination: {
                currentPage, pageSize, total: count
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询文章详情
 * GET /articles/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params

        const article = await Article.findByPk(id)

        if (!article) {
            throw new NotFoundError(`ID: ${id}的文章未查到`)
        }

        success(res, "查询成功。", {article})
    } catch (error) {
        failure(res, error)
    }
})


module.exports = router;

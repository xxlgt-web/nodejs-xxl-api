const express = require('express');
const router = express.Router(); // 定义路由
const {Course, Category, User, Chapter} = require("../models")
const {failure, success} = require("../utils/responses");
const {NotFoundError} = require("../utils/errors");

/**
 * 查询课程列表数据
 * GET /courses
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.currentPage)) || 10
        const offset = (currentPage - 1) * pageSize

        if (!query.categoryId) {
            throw new Error("获取课程列表失败，分类ID不能为空。")
        }

        const condition = {
            attributes: {exclude: ["CategoryId", "UserId", "content"]},
            where: {categoryId: query.categoryId},
            order: [["id", "DESC"]],
            limit: pageSize,
            offset
        }

        const {count, rows} = await Course.findAndCountAll(condition)


        success(res, "查询成功", {
            courses: rows,
            pagination: {
                total: count,
                pageSize,
                currentPage
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询课程详情数据
 * GET /courses/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params // 拿到课程id
        const condition = {
            attributes: {exclude: ["CategoryId", "UserId"]},
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["id", "name"]
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "username", "nickname", "avatar", "company"]
                },
                {
                    model: Chapter,
                    as: "chapters",
                    attributes: ["id", "title", "rank", "createdAt"],
                    order: [["rank", "ASC"], ["id", "DESC"]]
                }
            ]
        }

        const course = await Course.findByPk(id, condition)

        if (!condition) {
            throw new NotFoundError(`ID: ${id}的课程未找到。`)
        }


        success(res, "查询成功", course)
    } catch (error) {
        failure(res, error)
    }

})


module.exports = router;

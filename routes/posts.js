const express = require('express');
const router = express.Router(); // 定义路由
const {Post, Course} = require("../models")
const {success, failure} = require("../utils/responses")

/**
 * 查询
 * GET /posts
 */
router.get("/", async function (req, res, next) {
    try {

        const data = await Post.findAll({
            include: [
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "name"]
                }
            ]
        })

        success(res, "查询成功。", data)

    } catch (error) {
        failure(res, error)
    }
})

module.exports = router
const express = require('express');
const router = express.Router(); // 定义路由
const {Category} = require("../models")
const {failure, success} = require("../utils/responses");

/**
 * 查询f分类列表数据
 * GET /categories
 */
router.get("/", async function (req, res, next) {
    try {
        const categories = await Category.findAll({
            order: [["rank", "ASC"], ["id", "DESC"]]
        })

        success(res, "获取分类成功", {categories})
    } catch (error) {
        failure(res, error)
    }
})


module.exports = router;

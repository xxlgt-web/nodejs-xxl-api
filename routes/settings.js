const express = require('express');
const router = express.Router(); // 定义路由
const {Setting} = require("../models")
const {failure, success} = require("../utils/responses");
const {NotFoundError} = require("../utils/errors");

/**
 * 查询系统信息
 * GET /settings
 */
router.get("/", async function (req, res, next) {
    try {
        const setting = await Setting.findOne()

        if (!setting) {
            throw new NotFoundError(`系统信息未查到`)
        }

        success(res, "查询成功。", {setting})
    } catch (error) {
        failure(res, error)
    }
})


module.exports = router;

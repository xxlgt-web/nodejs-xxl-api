const express = require('express');
const router = express.Router(); // 定义路由
const {Setting: Settings} = require("../../models")
const {
    success,
    failure
} = require("../../utils/responses")
const {NotFoundError} = require("../../utils/errors")

/**
 * 查询系统设置列表
 * GET /admin/settings
 */
router.get("/", async function (req, res, next) {
    try {
        const setting = await getSetting()

        success(res, "查询成功", {setting})
    } catch (error) {
        failure(res, error)
    }
})


/**
 * 更新系统设置
 * PUT /admin/settings
 */
router.put("/", async function (req, res, next) {
    try {
        const setting = await getSetting()
        const body = filterBody(req)

        await setting.update(body)
        success(res, "更新系统设置成功", {setting})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 根据系统设置id查询指定系统设置
 * @param id 系统设置id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getSetting() {
    const setting = await Settings.findOne()
    if (!setting) {
        throw new NotFoundError(`系统设置未找到`)
    }
    return setting
}


/**
 * 白名单过滤
 * @param req 请求体
 * @returns {{copyright: *, icp: *, name: *}}
 */
function filterBody(req) {
    const {name, icp, copyright} = req.body
    return {
        name, icp, copyright
    }
}

module.exports = router;

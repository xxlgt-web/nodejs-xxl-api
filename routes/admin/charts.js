const express = require("express")
const router = express.Router()
const {User, sequelize} = require("../../models")
const {
    success,
    failure
} = require("../../utils/responses")

/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get("/sex", async function (req, res, next) {
    try {
        const male = await User.count({where: {sex: 0}})
        const female = await User.count({where: {sex: 1}})
        const unknownSex = await User.count({where: {sex: 2}})

        success(res, "查询用户性别成功", [
            {value: male, name: "男性"},
            {value: female, name: "女性"},
            {value: unknownSex, name: "无性别"},
        ])
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 统计每个月的用户注册数量
 * GET /admin/charts/user
 */
router.get("/user", async function (req, res, next) {
    try {
        // 执行原始 SQL 语句
        const [results] = await sequelize.query("SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC")

        const data = {
            values: [],
            months: []
        }

        results.forEach(item => {
            data.months.push(item.month)
            data.values.push(item.value)
        })


        success(res, "查询用户性别成功", data)
    } catch (error) {
        failure(res, error)
    }
})

module.exports = router;
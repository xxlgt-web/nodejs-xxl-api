const express = require('express');
const router = express.Router(); // 定义路由
const {Op} = require('sequelize')
const {Category, Course} = require("../../models")
const {
    success,
    failure
} = require("../../utils/responses")
const {NotFoundError} = require("../../utils/errors")

/**
 * 查询分类列表 支持模糊搜索、分页查询
 * GET /admin/categories
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        // 处理分页
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        const condition = {
            order: [["rank", "ASC"], ['id', "ASC"]], limit: pageSize, offset: offset
        }

        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }


        const {count, rows} = await Category.findAndCountAll(condition) // findAndCountAll 除了获取到查询的数据，还能获取到数据数量

        success(res, "查询成功", {
            categories: rows, pagination: {
                currentPage, pageSize, total: count
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询分类详情
 * GET /admin/categories/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const category = await getCategoryById(id)
        success(res, "查询成功", {category})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 创建分类
 * POST /admin/categories
 */
router.post('/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const category = await Category.create(body)

        // 201 状态码与 200 状态码一样都表示成功处理了请求，但是201还表示同事创建了新的资源
        success(res, "创建分类成功", {category}, 201)
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 删除分类详情
 * DELETE /admin/categories/:id
 */
router.delete("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const category = await getCategoryById(id)

        const count = await Course.count({where: {categoryId: req.params.id}}) // 查询课程表里面是否有关于课程的记录
        if (count > 0) {
            throw new Error("当前分类有课程无法删除")
        }

        await category.destroy()
        success(res, "删除分类成功")
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const category = await getCategoryById(id)
        const body = filterBody(req)

        await category.update(body)
        success(res, "更新分类成功", {category})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 根据分类id查询指定分类
 * @param id 分类id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getCategoryById(id) {
    const category = await Category.findByPk(id)
    if (!category) {
        throw new NotFoundError(`ID:${id}的分类未找到`)
    }
    return category
}


/**
 * 白名单过滤
 * @param req 请求参数
 * @returns {{name: *, rank: *}}
 */
function filterBody(req) {
    const {name, rank} = req.body
    return {
        name,
        rank
    }
}

module.exports = router;

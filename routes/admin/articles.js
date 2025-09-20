const express = require('express');
const router = express.Router(); // 定义路由
const {Op} = require('sequelize')
const {Article} = require("../../models")
const {
    success,
    failure
} = require("../../utils/responses")
const {NotFoundError} = require("../../utils/errors")

/**
 * 查询文章列表 支持模糊搜索、分页查询
 * GET /admin/articles
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        const condition = {
            order: [['id', "DESC"]], limit: pageSize, offset: offset
        }

        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }


        const {count, rows} = await Article.findAndCountAll(condition) // findAndCountAll 除了获取到查询的数据，还能获取到数据数量

        success(res, "查询成功", {
            articles: rows, pagination: {
                currentPage, pageSize, total: count
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询文章详情
 * GET /admin/articles/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const article = await getArticleById(id)
        success(res, "查询成功", {article})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 创建文章
 * POST /admin/articles
 */
router.post('/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const article = await Article.create(body)

        // 201 状态码与 200 状态码一样都表示成功处理了请求，但是201还表示同事创建了新的资源
        success(res, "创建文章成功", {article}, 201)
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 删除文章详情
 * DELETE /admin/articles/:id
 */
router.delete("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const article = await getArticleById(id)
        await article.destroy()
        success(res, "删除文章成功")
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 更新文章
 * PUT /admin/articles/:id
 */
router.put("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const article = await getArticleById(id)
        const body = filterBody(req)

        await article.update(body)
        success(res, "更新文章成功", {article})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 根据文章id查询指定文章
 * @param id 文章id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getArticleById(id) {
    const article = await Article.findByPk(id)
    if (!article) {
        throw new NotFoundError(`ID:${id}的文章未找到`)
    }
    return article
}

/**
 * 白名单过滤
 * @param req 请求参数
 * @returns {{title: *, content: *}}
 */
function filterBody(req) {
    const {title, content} = req.body
    return {
        title,
        content
    }
}

module.exports = router;

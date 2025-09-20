const express = require('express');
const router = express.Router(); // 定义路由
const {Op} = require('sequelize')
const {Course, Category, User, Chapter} = require("../../models")
const {
    success,
    failure
} = require("../../utils/responses")
const {NotFoundError} = require("../../utils/errors")

/**
 * 查询课程列表 支持模糊搜索、分页查询
 * GET /admin/courses
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        const condition = {
            ...getCondition(),
            order: [['id', "DESC"]],
            limit: pageSize,
            offset: offset,
            where: {}
        }

        // 处理精确和模糊搜索
        if (query.categoryId) {
            condition.where['categoryId'] = {
                [Op.eq]: query.categoryId
            }
        }
        if (query.userId) {
            condition.where['userId'] = {
                [Op.eq]: query.userId
            }
        }
        if (query.name) {
            condition.where['name'] = {
                [Op.eq]: query.name
            }
        }
        if (query.recommended) {
            condition.where['recommended'] = {
                [Op.eq]: query.recommended === "true"
            }
        }
        if (query.introductory) {
            condition.where['introductory'] = {
                [Op.eq]: query.introductory === "true"
            }
        }

        if (Reflect.ownKeys(condition.where).length === 0) {
            delete condition.where
        }


        const {count, rows} = await Course.findAndCountAll(condition) // findAndCountAll 除了获取到查询的数据，还能获取到数据数量

        success(res, "查询成功", {
            courses: rows, pagination: {
                currentPage, pageSize, total: count
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询课程详情
 * GET /admin/courses/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const course = await getCourseById(id)
        success(res, "查询成功", {course})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 创建课程
 * POST /admin/courses
 */
router.post('/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        // 看看是谁登录的，userId对应的就是谁
        body.userId = req.user.userId
        const course = await Course.create(body)

        // 201 状态码与 200 状态码一样都表示成功处理了请求，但是201还表示同事创建了新的资源
        success(res, "创建课程成功", {course}, 201)
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 删除课程详情
 * DELETE /admin/courses/:id
 */
router.delete("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const course = await getCourseById(id)

        const count = await Chapter.count({where: {courseId: req.params.id}}) // 查询课程表里面是否有关于课程的记录
        if (count > 0) {
            throw new Error("当前分类有章节无法删除")
        }

        await course.destroy()
        success(res, "删除课程成功")
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 更新课程
 * PUT /admin/courses/:id
 */
router.put("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const course = await getCourseById(id)
        const body = filterBody(req)

        await course.update(body)
        success(res, "更新课程成功", {course})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 关联分类用户数据
 * @returns {{include: [{as: string, model, attributes: string[]},{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: {exclude: ["CategoryId", "UserId"]}, // 排除 CategoryId UserId
        include: [
            {
                model: Category,
                as: "category", // 起别名为小写的
                attributes: ["id", "name"] // 筛选出部分限定字段
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "username", "avatar"]
            }
        ],
    }
}

/**
 * 根据课程id查询指定课程
 * @param id 课程id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getCourseById(id) {
    const condition = getCondition()
    const course = await Course.findByPk(id, condition)
    if (!course) {
        throw new NotFoundError(`ID:${id}的课程未找到`)
    }
    return course
}


/**
 * 白名单过滤
 * @param req 请求参数
 * @returns {{title: *, content: *}}
 */
function filterBody(req) {
    return {
        categoryId: Number(req.body.categoryId),
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,
        likesCount: Number(req.body.likesCount),
        chaptersCount: Number(req.body.chaptersCount),
    }
}

module.exports = router;

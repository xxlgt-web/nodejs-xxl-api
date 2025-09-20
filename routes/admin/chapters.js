const express = require('express');
const router = express.Router(); // 定义路由
const {Op} = require('sequelize')
const {Chapter, Course} = require("../../models")
const {
    success,
    failure
} = require("../../utils/responses")
const {NotFoundError} = require("../../utils/errors")

/**
 * 查询课程章节列表 支持模糊搜索、分页查询
 * GET /admin/chapters
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        if (!query.courseId) {
            throw new Error("获取章节列表失败，课程ID不能为空")
        }

        const condition = {
            ...getCondition(),
            order: [["rank", "ASC"], ['id', "ASC"]],
            limit: pageSize,
            offset: offset,
            where: {}
        }

        // 处理精确和模糊搜索
        if (query.courseId) {
            condition.where['courseId'] = {
                [Op.eq]: query.courseId
            }
        }
        if (query.title) {
            condition.where['title'] = {
                [Op.like]: `%${query.title}%`
            }
        }

        if (Reflect.ownKeys(condition.where).length === 0) {
            delete condition.where
        }


        const {count, rows} = await Chapter.findAndCountAll(condition) // findAndCountAll 除了获取到查询的数据，还能获取到数据数量

        success(res, "查询成功", {
            chapters: rows, pagination: {
                currentPage, pageSize, total: count
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询课程章节详情
 * GET /admin/chapters/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const chapter = await getChapterById(id)
        success(res, "查询成功", {chapter})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 创建课程章节
 * POST /admin/chapters
 */
router.post('/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const chapter = await Chapter.create(body)

        // 201 状态码与 200 状态码一样都表示成功处理了请求，但是201还表示同事创建了新的资源
        success(res, "创建课程章节成功", {chapter}, 201)
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 删除课程章节详情
 * DELETE /admin/chapters/:id
 */
router.delete("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const chapter = await getChapterById(id)

        await chapter.destroy()
        success(res, "删除课程章节成功")
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 更新课程章节
 * PUT /admin/chapters/:id
 */
router.put("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const chapter = await getChapterById(id)
        const body = filterBody(req)

        await chapter.update(body)
        success(res, "更新课程章节成功", {chapter})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 公共关联课程
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        attributes: {exclude: ["CourseId"]},
        include: [
            {
                model: Course,
                as: "course",
                attributes: ["id", "name"]
            }
        ]
    }
}

/**
 * 根据课程章节id查询指定课程章节
 * @param id 课程章节id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getChapterById(id) {
    const condition = getCondition()
    const chapter = await Chapter.findByPk(id, condition)
    if (!chapter) {
        throw new NotFoundError(`ID:${id}的课程章节未找到`)
    }
    return chapter
}

/**
 * 白名单过滤
 * @param req 请求参数
 * @returns {{rank: (number|*), video: (string|boolean|MediaTrackConstraints|VideoConfiguration|*), title, courseId: (number|*), content}}
 */
function filterBody(req) {
    return {
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank,
    }
}

module.exports = router;

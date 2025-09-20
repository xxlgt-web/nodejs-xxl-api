const express = require('express');
const router = express.Router(); // 定义路由
const {Op} = require('sequelize')
const {User} = require("../../models")
const {success, failure} = require("../../utils/responses")
const {NotFoundError} = require("../../utils/errors")

/**
 * 查询用户列表 支持模糊搜索、分页查询
 * GET /admin/users
 */
router.get("/", async function (req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        const condition = {
            order: [['id', "DESC"]],
            limit: pageSize,
            offset: offset,
            where: {}
        }

        // 处理精确和模糊搜索
        if (query.email) {
            condition.where['email'] = {
                [Op.eq]: query.email
            }
        }
        if (query.username) {
            condition.where['username'] = {
                [Op.eq]: query.username
            }
        }
        if (query.nickname) {
            condition.where['nickname'] = {
                [Op.like]: `%${query.nickname}%`
            }
        }
        if (query.role) {
            condition.where['role'] = {
                [Op.eq]: query.role
            }
        }

        if (Reflect.ownKeys(condition.where).length === 0) {
            delete condition.where
        }


        const {count, rows} = await User.findAndCountAll(condition) // findAndCountAll 除了获取到查询的数据，还能获取到数据数量

        success(res, "查询成功", {
            users: rows, pagination: {
                currentPage, pageSize, total: count
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询用户详情
 * GET /admin/users/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const user = await getUserById(id)
        success(res, "查询成功", {user})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 创建用户
 * POST /admin/users
 */
router.post('/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const user = await User.create(body)

        // 201 状态码与 200 状态码一样都表示成功处理了请求，但是201还表示同事创建了新的资源
        success(res, "创建用户成功", {user}, 201)
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 更新用户
 * PUT /admin/users/:id
 */
router.put("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        const user = await getUserById(id)
        const body = filterBody(req)

        await user.update(body)
        success(res, "更新用户成功", {user})
    } catch (error) {
        failure(res, error)
    }
})

/**
 * 根据用户id查询指定用户
 * @param id 用户id
 * @returns {Promise<Model<any, TModelAttributes>>}
 */
async function getUserById(id) {
    const user = await User.findByPk(id)
    if (!user) {
        throw new NotFoundError(`ID:${id}的用户未找到`)
    }
    return user
}


/**
 * 白名单过滤
 * @param req 请求参数
 * @returns {{password, role: (number|string|*), introduce: ({type: *}|*), sex: (number|*), nickname: (string|*), company: ({type: *}|*), avatar: ({type: *, validate: {isUrl: {msg: string}}}|*), email: (string|*), username}}
 */
function filterBody(req) {
    return {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: Number(req.body.sex),
        company: req.body.company,
        introduce: req.body.introduce,
        role: Number(req.body.role),
        avatar: req.body.avatar,
    }
}

module.exports = router;

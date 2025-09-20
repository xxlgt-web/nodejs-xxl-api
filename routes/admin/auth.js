const express = require('express');
const router = express.Router(); // 定义路由
const {Op} = require('sequelize')
const {User} = require("../../models")
const {success, failure} = require("../../utils/responses")
const {NotFoundError, BadRequestError, UnauthorizedError} = require("../../utils/errors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post("/sign_in", async function (req, res, next) {
    try {
        const {login, password} = req.body

        if (!login) {
            throw new BadRequestError("邮箱/用户名必须填写")
        }
        if (!password) {
            throw new BadRequestError("密码必须填写")
        }


        const condition = {
            where: {
                [Op.or]: [
                    {email: login},
                    {username: login},
                ]
            }
        }

        // 通过 user 或 username 来验证用户是否存在
        const user = await User.findOne(condition)
        if (!user) {
            throw new NotFoundError("用户不存在")
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if (!isPasswordValid) {
            throw new BadRequestError("密码错误")
        }


        // 验证是否为管理员
        if (user.role !== 100) {
            throw new UnauthorizedError("你没有权限登陆管理员后台")
        }

        // 生成身份验证令牌token
        const token = jwt.sign({
            userId: user.id
        }, process.env.SECRET, {expiresIn: '30d'});

        success(res, "登陆成功。", {token})

    } catch (error) {
        failure(res, error)
    }
})

module.exports = router
const express = require('express');
const router = express.Router(); // 定义路由
const {Like, Course, User} = require("../models")
const {failure, success} = require("../utils/responses");
const {NotFoundError} = require("../utils/errors");

/**
 * 点赞，取消赞
 * POST /likes
 */
router.post("/", async function (req, res, next) {
    try {
        const userId = req.userId
        const {courseId} = req.body

        const course = await Course.findByPk(courseId)
        if (!course) {
            throw new NotFoundError("课程不存在。")
        }

        // 检查之前查课程是否已经点过赞
        const like = await Like.findOne({
            where: {userId, courseId}
        })

        // 如果没有点赞过，就进行点赞
        if (!like) {
            await Like.create({userId, courseId})
            await course.increment("likesCount")
            success(res, "点赞成功")
        } else {
            //  点赞过了，就进行删除
            await like.destroy()
            await course.decrement("likesCount")
            success(res, "取消点赞成功")
        }

    } catch (error) {
        failure(res, error)
    }
})

/**
 * 查询用户点赞过的课程
 * GET /likes
 */
router.get("/", async function (req, res, next) {
    try {
        //  通过课程查询点赞过的用户
        // const course = await Course.findByPk(1, {
        //     include: {
        //         model: User,
        //         as: "likeUsers"
        //     }
        // })

        // 通过用户查询点赞过的过程
        // const user = await User.findByPk(req.userId, {
        //     include: {
        //         model: Course,
        //         as: "likeCourses"
        //     }
        // })

        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1 // 默认显示第一页
        const pageSize = Math.abs(Number(query.pageSize)) || 10 // 默认一页10条
        const offset = (currentPage - 1) * pageSize

        // 查询当前用户
        const user = await User.findByPk(req.userId)
        // 查询当前用户点赞过的课程
        const courses = await user.getLikeCourses({
            joinTableAttributes: [], // 表示关联表需要查询的属性，传递一个空数组，表示关联表属性什么都不查
            attributes: {exclude: ["CategoryId", "UserId", "content"]},
            order: [["id", "DESC"]],
            limit: pageSize,
            offset
        })

        const total = await user.countLikeCourses()

        success(res, "查询用户点赞的课程成功。", {
            courses,
            pagination: {
                total,
                currentPage,
                pageSize
            }
        })
    } catch (error) {
        failure(res, error)
    }
})

module.exports = router;

const express = require('express');
const router = express.Router(); // 定义路由
const {Chapter, Course, User} = require("../models")
const {failure, success} = require("../utils/responses");
const {NotFoundError} = require("../utils/errors");

/**
 * 查询章节详情
 * GET /chapters/:id
 */
router.get("/:id", async function (req, res, next) {
    try {
        const {id} = req.params
        // const condition = {
        //     attributes: {exclude: ["CourseId"]},
        //     include: [
        //         {
        //             model: Course,
        //             as: "course",
        //             attributes: ["id", "name"],
        //             // 先通过章节查询到课程，再通过课程才能查询到用户   注意关联关系
        //             include: [
        //                 {
        //                     model: User,
        //                     as: "user",
        //                     attributes: ["id", "username", "nickname", "avatar", "company"]
        //                 }
        //             ]
        //         }
        //     ]
        // }

        const chapter = await Chapter.findByPk(id, {
            attributes: {exclude: ["CourseId"]},
        })
        if (!chapter) {
            throw new NotFoundError(`ID: ${id}的课程未查到`)
        }

        // 查询章节关联的课程
        const course = await chapter.getCourse({
            attributes: ["id", "name", "userId"],
        })

        // 查询课程关联的用户
        const user = await course.getUser({
            attributes: ["id", "username", "nickname", "avatar", "company"]
        })

        // 同属于一个课程的所有章节
        const chapters = await Chapter.findAll({
            attributes: {exclude: ["CourseId", "content"]},
            where: {courseId: chapter.courseId},
            order: [["rank", "ASC"], ["id", "DESC"]]
        })

        success(res, "查询成功。", {
            chapter, course, user, chapters
        })
    } catch (error) {
        failure(res, error)
    }
})


module.exports = router;

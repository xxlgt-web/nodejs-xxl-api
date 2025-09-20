'use strict';
const {
    Model
} = require('sequelize');
const moment = require("moment/moment")
moment.locale("zh-cn")

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            //   设置关联模型
            models.Course.belongsTo(models.Category, {as: "category"}) // 课程属于分类
            models.Course.belongsTo(models.User, {as: "user"}) // 课程属于用户

            // 每个课程都有许多章节
            models.Course.hasMany(models.Chapter, {as: "chapters"})

            // 多对多关联 通过 through 字段表示通过 likes 表中的外键 courseId 来进行关联
            models.Course.belongsToMany(models.User, {through: models.Like, foreignKey: "courseId", as: "likeUsers"})
        }
    }

    Course.init({
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {msg: "分类ID必须填写"},
                notEmpty: {msg: "分类ID不能为空"},
                // 自定义验证: 验证该分类是否存在
                async isPresent(value) {
                    const category = await sequelize.models.Category.findByPk(value)
                    if (!value) throw new Error(`ID: ${value} 的分类不存在。`)
                }
            }
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            validate: {
                notNull: {msg: "用户ID必须填写"},
                notEmpty: {msg: "用户ID不能为空"},
                // 自定义验证: 验证用户是否存在
                async isPresent(value) {
                    const category = await sequelize.models.User.findByPk(value)
                    if (!value) throw new Error(`ID: ${value} 的用户不存在。`)
                }
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "课程名称必须填写"},
                notEmpty: {msg: "课程名称不能为空"},
            }
        },
        image: {
            type: DataTypes.STRING,
            validate: {
                isUrl: {msg: "图片地址不正确。"}
            }
        },
        recommended: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        introductory: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        content: DataTypes.TEXT,
        likesCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        chaptersCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                // 使用 moment.js 来格式化时间
                return moment(this.getDataValue("createdAt")).format("LL")
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue("updatedAt")).format("LL")
            }
        }
    }, {
        sequelize,
        modelName: 'Course',
    });
    return Course;
};
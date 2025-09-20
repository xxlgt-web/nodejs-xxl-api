'use strict';
const {
    Model
} = require('sequelize');
const bcrypt = require("bcryptjs")
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.User.hasMany(models.Course, {as: "courses"}) // 每个用户会有很多课程

            // 多对多关联 通过 through 字段表示通过 likes 表中的外键 userId 来进行关联
            models.User.belongsToMany(models.Course, {through: models.Like, foreignKey: "userId", as: "likeCourses"})
        }
    }

    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "邮箱必须填写。"},
                notEmpty: {msg: "邮箱不能为空"},
                isEmail: {msg: "邮箱格式不正确"},
                async isUnique(value) {
                    const user = await User.findOne({where: {email: value}})
                    if (user) {
                        throw new Error("邮箱已存在，请直接登录。")
                    }
                }
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "用户名必须填写。"},
                notEmpty: {msg: "用户名不能为空"},
                async isUnique(value) {
                    const user = await User.findOne({where: {username: value}})
                    if (user) {
                        throw new Error("用户名已存在。")
                    }
                }
            }
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "昵称必须填写。"},
                notEmpty: {msg: "昵称不能为空"},
                len: {args: [2, 45], msg: "昵称长度在2-45个字符之间。"}
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "密码必须填写。"},
                notEmpty: {msg: "密码不能为空"},
                // len: {args: [8, 16], msg: "密码长度在2-45个字符之间。"}
            },
            // sequelize 会对 password 字段进行处理
            set(value) {
                if (value.length >= 8 && value.length <= 16) {
                    this.setDataValue("password", bcrypt.hashSync(value, 10))
                } else {
                    throw new Error("密码长度在8-16个字符之间。")
                }
            }
        },
        sex: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                notNull: {msg: "性别必须填写。"},
                notEmpty: {msg: "性别不能为空"},
                isIn: {args: [[0, 1, 2]], msg: "性别的值必须是，男性：0，女性：1，无性别：2。"}
            }
        },
        company: DataTypes.STRING,
        introduce: DataTypes.TEXT,
        role: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                notNull: {msg: "用户组必须填写。"},
                notEmpty: {msg: "用户组不能为空"},
                isIn: {args: [[0, 100]], msg: "用户组的值必须是，普通用户：0，管理员：100。"}
            }
        },
        avatar: {
            type: DataTypes.STRING,
            validate: {
                isUrl: {msg: "图片地址不正确。"}
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            // 使用 get 方法可以在读取该属性值时处理完之后再返回
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
        modelName: 'User',
    });
    return User;
};
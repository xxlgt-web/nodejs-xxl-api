'use strict';
const {
    Model
} = require('sequelize');
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Category.hasMany(models.Course, {as: "courses"})
        }
    }

    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: "名称必须填写。"},
                notEmpty: {msg: "名称不能为空"},
                len: {args: [2, 45], msg: "名称长度在2-45个字符之间。"},
                async isUnique(value) {
                    const user = await Category.findOne({where: {name: value}})
                    if (user) {
                        throw new Error("名称已存在。")
                    }
                }
            }
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {mgs: "排序必须填写。"},
                notEmpty: {msg: "排序不能为空。"},
                isInt: {msg: "排序必须为整数。"},
                // 自定义验证
                isPositive(value) {
                    if (value <= 0) {
                        throw new Error("排序必须是正整数。")
                    }
                }
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
        modelName: 'Category',
    });
    return Category;
};
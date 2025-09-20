'use strict';
const {
    Model
} = require('sequelize');
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
    class Article extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Article.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            // 数据验证
            validate: {
                notNull: {
                    msg: "标题必须存在",
                },
                notEmpty: {
                    msg: '标题不能为空',
                },
                len: {
                    args: [2, 45],
                    msg: '标题长度需要在2~45个字符之间'
                }
            }
        },
        content: DataTypes.TEXT,
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
        modelName: 'Article',
    });
    return Article;
};
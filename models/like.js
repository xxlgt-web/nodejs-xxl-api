'use strict';
const {
    Model
} = require('sequelize');
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Like.init({
        courseId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
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
        modelName: 'Like',
    });
    return Like;
};
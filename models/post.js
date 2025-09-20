'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 因为数据库中的 xxl_posts 表中的列明 course_id 不符合 sequelize 中的命名规则（大驼峰） 所以需要定义一个一对多关联
            models.Post.belongsTo(models.Course, {
                foreignKey: "course_id", // 指定一下关联的字段
                as: "course"
            })
        }
    }

    Post.init({
        course_id: DataTypes.INTEGER,
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Post',
        tableName: "xxl_posts", // 指定当前模型对应的数据库的表名
        timestamps: false // 不需要时间字段
    });
    return Post;
};
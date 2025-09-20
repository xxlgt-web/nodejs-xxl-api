const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
// 引入环境变量
require("dotenv").config()
// 引入中间件
const adminAuth = require("./middlewares/admin-auth")
const userAuth = require("./middlewares/user-auth")

// 前台路由文件
const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');
const articlesRouter = require('./routes/articles');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const likesRouter = require('./routes/likes');
const postsRouter = require('./routes/posts');

// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS 跨域配置
const corsConfig = {
    origin: [
        "http://xxl-api.cn",
        "http://localhost:63343"
    ] // 设置指定跨域源 源地址数组或者单个源地址
}
app.use(cors(corsConfig)) // 注意位置，需要放在其他路由的 use 上面

// 前台路由文件
app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);
app.use('/chapters', chaptersRouter);
app.use('/articles', articlesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/users', userAuth, usersRouter);
app.use('/likes', userAuth, likesRouter);
app.use('/posts', postsRouter);

// 后台路由配置 在访问接口之前需要经过token验证
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/courses', adminAuth, adminCoursesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter); // 登录中不需要经过 token 验证

module.exports = app;

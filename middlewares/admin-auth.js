const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { failure } = require("../utils/responses");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

module.exports = async (req, res, next) => {
  try {
    // 判断 Token 是否存在
    const { token } = req.headers;

    console.log(token, "token");

    if (!token) {
      throw new UnauthorizedError("当前接口需要认证才能访问");
    }

    // 验证 token 是否正确
    const decoded = jwt.verify(token, process.env.SECRET); // 解析 token

    // 从 jwt 中解析出之前存在的 userId
    const { userId } = decoded;

    // 查询用户是否存在
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("用户不存在");
    }

    // 验证是否为管理员
    if (user.role !== 100) {
      throw new UnauthorizedError("你没有权限登陆管理员后台");
    }

    //  通过验证，将 user 对象 挂载到 req 上，方便后续中间件或者路由使用
    req["user"] = user;

    next();
  } catch (error) {
    failure(res, error);
  }
};

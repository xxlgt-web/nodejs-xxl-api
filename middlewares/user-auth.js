const jwt = require("jsonwebtoken");
const { failure } = require("../utils/responses");
const { UnauthorizedError } = require("../utils/errors");

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

    // 普通用户无需验证是否存在，因为后续的操作都是建立在登陆之上的

    //  通过验证，将 userId 对象 挂载到 req 上，方便后续中间件或者路由使用
    req["userId"] = userId;

    next();
  } catch (error) {
    failure(res, error);
  }
};

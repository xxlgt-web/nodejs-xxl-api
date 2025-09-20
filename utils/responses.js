/**
 * 请求成功
 * @param res 响应结果
 * @param message 响应结果消息
 * @param data 响应数据
 * @param code 状态码 默认值为200
 */
function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    })
}

/**
 * 请求失败
 * @param res 响应结果消息
 * @param error 错误
 * @returns {*} 错误的消息提示
 */
function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message)

        // 400 状态码表示请求中语法错误，例如无效参数或者格式不正确
        return res.status(400).json({
            status: false, message: "请求参数错误", data: errors
        })
    }

    if (error.name === 'BadRequestError') {
        return res.status(400).json({
            status: false, message: "请求参数错误", data: [error.message]
        })
    }
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false, message: "认证失败", data: [error.message]
        })
    }
    if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false, message: "资源不存在", data: [error.message]
        })
    }

    /**
     * token验证失败的异常
     * @example https://www.npmjs.com/package/jsonwebtoken
     */
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false, message: "认证失败", data: ["你提交的 token 错误"]
        })
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false, message: "认证失败", data: ["你的 token 已过期"]
        })
    }


    res.status(500).json({
        status: false, message: "服务器错误", data: [error.message]
    })

}

module.exports = {
    success,
    failure
}
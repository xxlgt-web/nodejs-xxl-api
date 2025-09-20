## node.js API开发学习

该项目使用了 Node.js + Express + MySQL + Sequelize ORM 开发。

## 配置环境变量

将`.env.example`文件拷贝为`.env`文件，并修改配置

```text
SECRET=你的密钥
PORT=3000
```

其中`PORT`配置为服务端口，`SECRET`配置为密钥

## 生成密钥

在命令行中运行

```shell
node
```

进入交互模式后，运行

```shell
const crypto = require("crypto")
console.log(crypto.randomBytes(32).toString("hex"))
```

复制得到的密钥，并填写到`.env`文件中的`SECRET`配置。

## 配置数据库

项目使用 **Dockers** 容器运行MySQL数据库。安装好 **Docker** 后，可直接启动MySQL。

```shell
docker-compose up -d
```

如需使用自行安装的 **MySQL**， 需要修改`config/config.js`文件中的数据库用户名与密码。

```json
{
  "development": {
    "username": "你的数据库用户名",
    "password": "你的数据库密码",
    "database": "数据库",
    "host": "域名"
  }
}
```

## 安装与运行

```shell
# 安装项目依赖包
npm i

# 创建数据库
npx sequelize-cli db:create --charset utf8mb4 --collate utf8mb4_general_ci

# 运行迁移，自行建表
npx sequelize-cli db:seed:all

# 启动服务
npm start
```

访问地址：http://127.0.0.1:3000/

## 初始管理员用户密码

```text
admin
123456
```

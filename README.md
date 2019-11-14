# Node.JS-Hapi
基于hapi的Node.JS后端开发指南，搭建敏捷高效的RESTful接口服务


### 工程目录结构
```
- config    # 项目配置目录
    - index.js      # 配置项目中的配置信息
- models    # 数据库表model
- node_modules      # 依赖
- plugins   # 插件目录
    - hapi-swagger.js   # swagger插件
- routes    # 路由目录
    - test.js   # 测试接口文件
- utils     # 工具类目录
- app.js    # 项目入口文件
- package.json      #JS项目工程依赖库
- readme.md     # 项目工程说明手册
```


### .env文件
> 在项目的实践过程中，往往也会和一些敏感的数据信息打交道，比如数据库的连接用户名、密码，第三方 SDK 的 secret 等。这些参数的配置信息，原则上是禁止进入到 git 版本仓库的。一来在开发环境中，不同的开发人员本地的开发配置各有不同，不依赖于 git 版本库配置。二来敏感数据的入库，增加了人为泄漏配置数据的风险，任何可以访问 git 仓库的开发人员，都可以从中获取到生产环境的 secret key。一旦被恶意利用，后果不堪设想。
```
如何读取.env中的配置值
Node.js可以通过env2的插件，来读取.env配置文件，加载后的环境配置参数，可以通过process.env.PORT等来读取

npm i env2

// 入口文件
require('env2')('./env')
```
> 最后，记得在 .gitignore 文件中增加一行 .env，用来避免该文件的 git 版本入库。


### Swagger & Joi
> Swagger目标是为REST APIs定义一个标准的，帮助我们在看不到具体源码的情况下能发现和理解各种服务的功能。并通过 swagger-ui 的网页输出，来形成一套美观简洁的可视化文档

> Joi是一种验证模块、主要可以用于请求入参的校验
```
安装
npm i hapi-swagger@7
npm i inert@4
npm i vision@4
npm i package


配置好插件配置后，入口文件需要对插件进行register

通过（自己的服务地址 + /documentation）来查看Swagger文档
```

```
安装
npm i joi@13

1 - 适用于动态路由的params验证
    例如动态路由所依赖的变量orderId/shopId是以params属性为字段来传递
    orderId:Joi.string().required()的描述，定义了orderId必须是字符串，且此参数必填。一旦用户端调用该接口，orderId并没有传入，就会返回如下的错误信息
    {
        "error": "Bad Request",
        "message": "此处会有明确的字段验证错误描述",
        "statusCode": 400
    }

2 - 适用于POST接口的payload（request body）验证
    比如订单的创建接口，POST 型，可能依赖多件商品，且各商品数量不同的复杂入参。此类的参数校验可以通过 validate.payload 来约束：
    // 入参的数据
    [
        { goods_id: 123, count: 1 },  // 1件 id 为 123 的商品
        { goods_id: 124, count: 2 },  // 2件 id 为 124 的商品
    ]

    // 对应的嵌套入参校验
    validate: {
        payload: {
            goodsList: Joi.array().items(
                Joi.object().keys({
                    goods_id: Joi.number().integer(),
                    count: Joi.number().integer()
                })
            )
        }
    }

3 - 适用于GET接口的query（URL路径参数）
    比如我们常见的带有分页特性的拉取店铺列表数据，往往涉及页码 page 和每个分页的条目数 limit。接口的体现形式通常是 http://localhost/shops?page=1&limit=10 。此类的参数校验可以通过 validate.query 来约束：
    validate: {
        query: {
            limit: Joi.number().integer().min(1).default(10).description('每页的条目数'),
            page: Joi.number().integer().min(1).default(1).description('页码数'),
        }
    }

4 - 适用于header额外字段约束的headers验证
    基于 JWT 的用户身份验证，会依赖 header 中的 authorization 字段的配置，但由于 header 中本身还涵盖了其他的字段属性，所以需要用 unknown 来做一个冗余处理：
    validate: {
        headers: Joi.object({
            authorization: Joi.string().required(),
        }).unknown(),
    }
```

### 使用Sequelize-cli
> Sequelize是NodeJs生态中一款知名的基于Promise数据库ORM插件，提供了大量常用数据库增删改查的函数式Api

```
以MySQL为基础数据库，安装如下依赖
- npm i sequelize-cli -D
    提供一些列好用的终端指令
- npm i sequelize
- npm i mysql2

cd到node_modules/.bin执行sequelize init

├── config                       # 项目配置目录
|   ├── config.json              # 数据库连接的配置 （提供开发、测试、生产三个默认样板环境）修改成config.js
├── models                       # 数据库 model
|   ├── index.js                 # 数据库连接的样板代码 （用于定义数据库表结构对于关系的模块目录）
├── migrations                   # 数据迁移的目录 （用于通过管理数据库表结构迁移的目录）
|       node_modules/.bin/sequelize db:migrate 帮助我们将migrations目录下的迁移行定义，最终完成数据表结构的自动化创建。
|       node_modules/.bin/sequelize db:migrate:undo 按照down方法中定义的规则，回退一个数据表结构迁移的状态
|       node_modules/.bin/sequelize db:migrate:undo:all --to xxxxxxxxx-create-shops-table.js 可以恢复到初始状态，也可以通过将其名称传递到--to来恢复到特定的迁移
├── seeders                      # 数据填充的目录 （用于在数据库完成migrations初始化后，填补一些打底数据的配置目录）
        node_modules/.bin/sequelize seed:create --name init-shops  这个命令会在seeder目录下创建一个种子文件，它遵循up/down语义
        node_modules/.bin/sequelize db:seed:all 向数据库填充seeders目录中所有的up方法所定义的数据（注意seeders的执行，不会将状态存储在SequelizeMeta表中）
        node_modules/.bin/sequelize db:seed --seed xxxxxxxxx-init-shops.js 也可以指定特定seed配置来填充
        node_modules/.bin/sequelize db:seed:undo:all  撤销所有种子
        node_modules/.bin/sequelize db:seed:undo --seed XXXXXXXXXXXXXX-demo-user.js 撤销指定种子


使用migrate来向shops表添加一列address字段
node_modules/.bin/sequelize migration:create --name add-columns-to-shops-table      # 创建一个新的迁移文件

添加代码
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('shops', 'address', { type: Sequelize.STRING }),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.removeColumn('shops', 'address'),
  ]),
}
再执行sequelize db:migrate
```

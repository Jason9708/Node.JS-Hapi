// 工程项目入口文件

const Hapi = require('hapi')
require('env2')('./.env')
const config = require('./config')
const testRouter = require('./routes/test')

// 引入自定义的hapi-swagger插件配置
const pluginHapiSwagger = require('./plugins/hapi-swagger')


// 创建Hapi框架服务
const server = new Hapi.Server()

// 配置服务器启动host和port
server.connection({
    port: config.port,
    host: config.host
})

const init = async() => {
    // 注册hapi-swagger
    await server.register([
        ...pluginHapiSwagger
    ]);
    server.route([
        // 测试test的接口
        ...testRouter
    ]);
    // start the service
    await server.start()
    console.log(`Server running at: ${server.info.uri} ♥ ♥ ♥ ♥ ♥ ♥`)
}

init()
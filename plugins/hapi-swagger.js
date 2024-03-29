// swagger 插件配置

const inert = require('inert')
const vision = require('vision')
const package = require('package')
const hapiSwagger = require('hapi-swagger')

module.exports = [
    inert,
    vision,
    {
        register: hapiSwagger,
        options: {
            info: {
                title: '接口文档',
                version: package.version,
            },
            // 定义接口以 tags 属性定义来进行分组
            grouping: 'tags',
            tags: [
                { name: 'tests', description: '测试相关' }
            ]
        }
    }
]
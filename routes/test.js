// 商品类测试接口文件

// 引入Joi
const Joi = require('Joi')

const GROUP_NAME1 = 'shops'
const GROUP_NAME2 = 'order'

module.exports = [{
        method: 'GET',
        path: `/${GROUP_NAME1}`,
        handler: (request, reply) => {
            reply()
        },
        /**
         *  为REST接口添加Swagger标记，在路由配置中的config字段增加tags:['api']即可将路由暴露为Swagger文档
         */
        config: {
            tags: ['api', GROUP_NAME1],
            description: '获取店铺列表',
            validate: {
                query: {
                    limit: Joi.number().integer().min(1).default(10).description('每页的条目数'),
                    page: Joi.number().integer().min(1).default(1).description('页码数'),
                },
            },
        }
    },
    {
        method: 'GET',
        path: `/${GROUP_NAME1}/{shopId}/goods`,
        handler: (request, reply) => {
            reply()
        },
        config: {
            tags: ['api', GROUP_NAME1],
            description: '获取店铺的商品列表',
            validate: {
                params: {
                    shopId: Joi.string().required(),
                },
            },
        }
    },
    {
        method: 'POST',
        path: `/${GROUP_NAME2}`,
        handler: (request, reply) => {
            reply()
        },
        config: {
            tags: ['api', GROUP_NAME2],
            description: '创建订单',
            validate: {
                // id | count 都应为整数
                payload: {
                    goodsList: Joi.array().items(
                        Joi.object().keys({
                            goods_id: Joi.number().integer(),
                            count: Joi.number().integer(),
                        }),
                    ),
                },
                // 认证
                headers: Joi.object({
                    authorization: Joi.string().required(),
                }).unknown(),
            },
        }
    },
    {
        method: 'POST',
        path: `/${GROUP_NAME2}/{orderId}/pay`,
        handler: (request, reply) => {
            reply()
        },
        config: {
            tags: ['api', GROUP_NAME2],
            description: '支付某条订单',
            validate: {
                params: {
                    orderId: Joi.string().required(),
                },
            },
        }
    },
]
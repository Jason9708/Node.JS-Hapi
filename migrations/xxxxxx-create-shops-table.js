// 'use strict';

// module.exports = {
//     // up用于定义表结构正向改变得细节
//     up: (queryInterface, Sequelize) => queryInterface.createTable(
//         'shops', {
//             id: {
//                 type: Sequelize.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             name: {
//                 type: Sequelize.STRING,
//                 allowNull: false,
//             },
//             thumb_url: Sequelize.STRING,
//             created_at: Sequelize.DATE,
//             updated_at: Sequelize.DATE
//         }
//     ),
//     // down用于定义表结构的回退逻辑
//     down: (queryInterface, Sequelize) => queryInterface.dropTable('shops')
// };
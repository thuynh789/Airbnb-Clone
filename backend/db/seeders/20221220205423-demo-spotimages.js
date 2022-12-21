'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'SpotImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.pinimg.com/originals/ba/53/89/ba5389484514c0aa232062040b7dd40e.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://www.shareoregon.com/things-to-do/system/images/237424/big/pionerplace3.jpg?1501559771',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.vox-cdn.com/thumbor/Mte_wxG4cKQw9PBh5cuMWgiw8Vw=/0x0:920x613/1200x800/filters:focal(581x104:727x250)/cdn.vox-cdn.com/uploads/chorus_image/image/63257148/Little_Big_Burger_.0.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://images.squarespace-cdn.com/content/v1/52310be0e4b03288c7519651/1378987369897-3NKMMFW76XV5S58K19AT/IMG_5676_1.jpg?format=2500w',
        preview: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     return queryInterface.bulkDelete(options, {}, {});
  }
};

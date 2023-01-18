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
        url: 'https://www.bu.edu/housing/files/2019/11/19-1780-HOUSING-019-1200x500.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dragonspell/images/w_540,h_675,c_fill,dpr_auto,fl_progressive:steep,f_auto/w_540,h_675/v1571421425/www.travelportland.com/6190488811_d5207f99ec_o/6190488811_d5207f99ec_o.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/ea/d2/a2/little-big-burger.jpg',
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

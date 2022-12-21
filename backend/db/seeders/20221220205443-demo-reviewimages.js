'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'ReviewImages';

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
        reviewId: 1,
        url: 'https://static.boredpanda.com/blog/wp-content/uploads/2014/11/miniature-mice-family-house-simon-dell-43.jpg'
      },
      {
        reviewId: 2,
        url: 'https://56paris.com/storage/uploads/c96c2d49-cc54-4236-9ea6-77d2c82fa6c4/dior-30-montaigne-boutique-c-kristen-pelou-1.jpg'
      },
      {
        reviewId: 3,
        url: 'https://www.schmidconstruction.com/wp-content/uploads/2019/05/HabitBurger6-copy.jpg'
      },
      {
        reviewId: 4,
        url: 'https://media.istockphoto.com/id/485377046/photo/young-drunk-man-sleeping-on-the-table-in-a-bar.jpg?s=612x612&w=0&k=20&c=uFSBZ12-ckX74M8ZPTZfl7WqiQcJFRJ2cfdlHlm2dY4='
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

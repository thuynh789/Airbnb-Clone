'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings';

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
        spotId: 4,
        userId: 1,
        startDate: new Date('2021-02-01'),
        endDate: new Date('2021-02-05')
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2023-03-15'),
        endDate: new Date('2023-03-20')
      },
      {
        spotId: 1,
        userId: 3,
        startDate: new Date('2023-04-01'),
        endDate: new Date('2023-04-09')
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2023-05-21'),
        endDate: new Date('2023-05-24')
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2023-11-17'),
        endDate: new Date('2023-11-23')
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

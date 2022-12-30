'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Reviews';

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
        userId: 2,
        review: 'We loved all the mice.',
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: 'We did not like all the mice.',
        stars: 2
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Very spacious. I slept in Dior.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Smells like beef!',
        stars: 3
      },
      {
        spotId: 4,
        userId: 1,
        review: 'I got very drunk and fell asleep so it was good.',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Smells like beef (in a bad way).',
        stars: 2
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

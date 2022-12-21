'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Spots';

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
      ownerId: 1,
      address: '173 Bay State Rd',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      lat: -1.00,
      lng: 8.23,
      name: 'Dorm of Sadness',
      description: 'If you like mice you will love this location.',
      price: 73000.00
     },
     {
      ownerId: 2,
      address: '700 SW 5th Ave',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      lat: -2.00,
      lng: 9.33,
      name: 'Pioneer Place',
      description: 'An upscale, urban shopping center.',
      price: 9999999.00
     },
     {
      ownerId: 2,
      address: '3810 SE Division St',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      lat: -3.00,
      lng: 10.33,
      name: 'Little Big Burger',
      description: 'Truffle fries and a root beer float please.',
      price: 7.25
     },
     {
      ownerId: 3,
      address: '53 W 35th St',
      city: 'New York City',
      state: 'NY',
      country: 'USA',
      lat: -4.00,
      lng: 11.33,
      name: 'Izakaya Mew',
      description: 'Good vibes only.',
      price: 5000000.00
     }
    ], {})
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

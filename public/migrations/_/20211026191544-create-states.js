'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('states', {
      id: {
        primaryKey: true,
        autoIncrement: false,
        unique: true,

        type: Sequelize.INTEGER,
        allowNull: false
        
      }, 

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      initials: {
        type: Sequelize.STRING(2),
        allowNull: false,
        unique: true,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('states');
  }
};

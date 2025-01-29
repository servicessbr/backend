'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cities', {
      id: {
        primaryKey: true,
        autoIncrement: false,
        unique: true,

        type: Sequelize.INTEGER,
        allowNull: false
        
      },  
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: { model: 'states', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cities');
  }
};

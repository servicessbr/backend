'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', { 
        id: {
          primaryKey: true,
          autoIncrement: true,
          unique: true,

          type: Sequelize.INTEGER,
          allowNull: false
          
        },
        
        uid: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        phone: {
          type: Sequelize.BIGINT,
          allowNull: true,
          unique: true,
        },
        avatar: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING(510),
          allowNull: true,
        },
        profession: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        refreshtoken: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
  }
};

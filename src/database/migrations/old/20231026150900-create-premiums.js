'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('premiums', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        unique: true,

        type: Sequelize.INTEGER,
        allowNull: false
      },

      user_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        references: { model: 'users', key: 'uid' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      credit: {
        type: Sequelize.SMALLINT,
        defaultValue: 2,
        allowNull: true
      },

      expiration: {
        type: Sequelize.DATE,
        allowNull: false
      },

      payday: {
        type: Sequelize.DATE,
        allowNull: true
      },

      bank: {
        type: Sequelize.SMALLINT,
        defaultValue: 323,
        allowNull: true
      },

      operation: {
        type: Sequelize.INTEGER,
        allowNull: true
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

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('premiums');
  }
};

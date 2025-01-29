'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('verifications', {
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
        unique: true,
        references: { model: 'users', key: 'uid' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      public_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      sensitive_data: {
        type: Sequelize.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('verifications');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('internationals', {
      work_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: false,
        references: { model: 'works', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      country: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
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
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('internationals');
  }
};

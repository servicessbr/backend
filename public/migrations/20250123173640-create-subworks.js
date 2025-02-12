'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('subworks', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        unique: true,

        type: Sequelize.INTEGER,
        allowNull: false
      },
      work_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: { model: 'works', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.REAL,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(510),
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
    return queryInterface.dropTable('subworks');
  }
};

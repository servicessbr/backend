'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('evaluations', {
      id: {
        primaryKey: true,
        autoIncrement: false,
        unique: true,
        references: { model: 'orders', key: 'id' },
        type: Sequelize.INTEGER,
        allowNull: false
      },
      stars: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        unique: false,
      },
      review_description: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: false
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
    return queryInterface.dropTable('evaluations');
  }
};

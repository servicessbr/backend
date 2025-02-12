'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('orders', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        unique: true,

        type: Sequelize.INTEGER,
        allowNull: false
      },
      provider_professional_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        references: { model: 'users', key: 'uid' },
      },
      payer_customer_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        references: { model: 'users', key: 'uid' },
      },
      execution_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      transaction_amount: {
        type: Sequelize.REAL,
        allowNull: false
      },
      original_subwork_title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
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
    return queryInterface.dropTable('orders');
  }
};

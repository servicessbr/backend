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

      client_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        references: { model: 'users', key: 'uid' }
      },

      prof_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        references: { model: 'users', key: 'uid' }
      },

      work_ref: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'works', key: 'id' }
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false
      },

      pix: {
        type: Sequelize.STRING,
        allowNull: false
      },

      price: {
        type: Sequelize.REAL,
        allowNull: true
      },

      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      ser_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ser_response: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      loc_place: {
        type: Sequelize.STRING,
        allowNull: false
      },
      loc_location: {
        type: Sequelize.STRING,
        allowNull: false
      },

      date_hours: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_day: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date_week: {
        type: Sequelize.STRING,
        allowNull: false
      },
      finished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('orders');
  }
};

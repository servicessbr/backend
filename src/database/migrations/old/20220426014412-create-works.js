'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('works', {
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

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tags: {
        type: Sequelize.STRING(510),
        allowNull: true,
      },

      remote: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      /*
      showemail: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      showphone: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      socialmedias: {
        type: Sequelize.STRING(510),
        allowNull: true,
      },
      */
      price: {
        type: Sequelize.REAL,
        allowNull: true,
      },
      discount: {
        type: Sequelize.SMALLINT,
        allowNull: true,
      },

      description: {
        type: Sequelize.STRING(510),
        allowNull: true,
      },
      details: {
        type: Sequelize.STRING(510),
        allowNull: true,
      },
      availability: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      hours: {
        type: Sequelize.STRING(17),
        allowNull: true,
      },

      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: { model: 'cities', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      district: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('works');
  }
};

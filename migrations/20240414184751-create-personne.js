'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Personnes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      prenom: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(120)
      },
      adresse: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      date_nais: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      lieu_nais: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      photo: {
        allowNull: false,
        defaultValue: 'default_photo.jpg',
        type: Sequelize.STRING
      },
      mdp: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      statue: {
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Personnes');
  }
};
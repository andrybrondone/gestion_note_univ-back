'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Enseignants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PersonneId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Personnes',
          key: 'id'
        }
      },
      grade: {
        allowNull: false,
        type: Sequelize.STRING
      },
      statut: {
        allowNull: false,
        type: Sequelize.STRING(10),
        defaultValue: 'actif'
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
    await queryInterface.dropTable('Enseignants');
  }
};
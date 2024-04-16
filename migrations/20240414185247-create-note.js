'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      etudiantId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Etudiants',
          key: 'id'
        }
      },
      matiereId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Matieres',
          key: 'id'
        }
      },
      note: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Notes');
  }
};
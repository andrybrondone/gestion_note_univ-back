'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Etudiants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      personneId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Personnes',
          key: 'id'
        }
      },
      matricule: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      niveau: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      parcours: {
        type: Sequelize.STRING(3),
        allowNull: false
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
    await queryInterface.dropTable('Etudiants');
  }
};
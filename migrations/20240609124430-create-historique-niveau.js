'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoriqueNiveaus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      EtudiantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Etudiants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      niveau: {
        type: Sequelize.STRING(3)
      },
      moyenne_pratique: {
        type: Sequelize.FLOAT(2),
        allowNull: false
      },
      date_changement: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('HistoriqueNiveaus');
  }
};
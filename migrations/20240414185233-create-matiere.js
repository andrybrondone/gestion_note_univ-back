'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Matieres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      enseignantId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Enseignants',
          key: 'id',
        }
      },
      moduleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Modules',
          key: 'id',
        }
      },
      nom_mat: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      credit: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      niveau_mat: {
        allowNull: false,
        type: Sequelize.STRING(3)
      },
      delete: {
        allowNull: false,
        type: Sequelize.STRING(6),
        defaultValue: 'false'
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
    await queryInterface.dropTable('Matieres');
  }
};
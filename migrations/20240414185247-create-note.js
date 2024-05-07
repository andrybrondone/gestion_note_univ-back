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
      EtudiantId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Etudiants',
          key: 'id'
        }
      },
      MatiereId: {
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
    }, {
      uniqueKeys: {
        uniqueGrade: {
          fields: ['EtudiantId', 'MatiereId']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notes');
  }
};
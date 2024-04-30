'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Note.belongsTo(models.Etudiant, {
        foreignKey: {
          allowNull: false
        }
      })
      models.Note.belongsTo(models.Matiere, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  }
  Note.init({
    note: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Note',
  });
  return Note;
};
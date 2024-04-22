'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etudiant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Etudiant.hasMany(models.Note)

      models.Etudiant.belongsTo(models.Personne, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  }
  Etudiant.init({
    matricule: DataTypes.STRING,
    niveau: DataTypes.STRING,
    parcours: DataTypes.STRING,
    statut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Etudiant',
  });
  return Etudiant;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Personne extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Personne.hasMany(models.Etudiant)
      models.Personne.hasMany(models.Enseignant)
    }
  }
  Personne.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    adresse: DataTypes.STRING,
    date_nais: DataTypes.DATEONLY,
    lieu_nais: DataTypes.STRING,
    photo: DataTypes.STRING,
    mdp: DataTypes.TEXT,
    statue: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Personne',
  });
  return Personne;
};
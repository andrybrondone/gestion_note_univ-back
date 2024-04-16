'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enseignant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Enseignant.hasMany(models.Matiere)

      models.Enseignant.belongsTo(models.Personne, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  }
  Enseignant.init({
    grade: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Enseignant',
  });
  return Enseignant;
};
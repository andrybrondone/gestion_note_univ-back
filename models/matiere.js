'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Matiere extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Matiere.hasMany(models.Note)

      models.Matiere.belongsTo(models.Enseignant, {
        foreignKey: {
          allowNull: false
        }
      })

      models.Matiere.belongsTo(models.Module, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  }
  Matiere.init({
    nom_mat: DataTypes.STRING,
    credit: DataTypes.INTEGER,
    niveau_mat: DataTypes.STRING,
    parcours: DataTypes.ARRAY(DataTypes.STRING),
    delete: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Matiere',
  });
  return Matiere;
};
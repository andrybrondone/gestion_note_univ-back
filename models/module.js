'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Module.hasMany(models.Matiere)
    }
  }
  Module.init({
    nom_module: DataTypes.STRING,
    delete: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoriqueNiveau extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.HistoriqueNiveau.belongsTo(models.Etudiant, {
        foreignKey: {
          allowNull: false
        }
      });
    }
  }
  HistoriqueNiveau.init({
    niveau: DataTypes.STRING,
    moyenne_pratique: DataTypes.FLOAT,
    date_changement: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'HistoriqueNiveau',
  });
  return HistoriqueNiveau;
};
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

      models.Etudiant.hasMany(models.HistoriqueNiveau);
    }

    // Méthode pour promouvoir l'étudiant
    static async promouvoir(etudiantId) {
      const etudiant = await Etudiant.findByPk(etudiantId);

      if (!etudiant) {
        throw new Error('Etudiant non trouvé');
      }

      // Enregistrer l'historique du niveau actuel
      await sequelize.models.HistoriqueNiveau.create({
        EtudiantId: etudiant.id,
        niveau: etudiant.niveau,
        moyenne_pratique: etudiant.moyenne_pratique,
        date_changement: new Date()
      });

      // Déterminer le nouveau niveau
      let nouveauNiveau;
      switch (etudiant.niveau) {
        case 'L1':
          nouveauNiveau = 'L2';
          break;
        case 'L2':
          nouveauNiveau = 'L3';
          break;
        case 'L3':
          nouveauNiveau = 'M1';
          break;
        case 'M1':
          nouveauNiveau = 'M2';
          break;
        // Ajouter d'autres niveaux si nécessaire
        default:
          throw new Error('Niveau actuel inconnu');
      }

      // Mettre à jour le niveau et moyenne pratique de l'étudiant
      etudiant.niveau = nouveauNiveau;
      etudiant.moyenne_pratique = null
      await etudiant.save();
    }
  }
  Etudiant.init({
    matricule: DataTypes.STRING,
    niveau: DataTypes.STRING,
    parcours: DataTypes.STRING,
    statut: DataTypes.STRING,
    moyenne_pratique: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Etudiant',
  });
  return Etudiant;
};
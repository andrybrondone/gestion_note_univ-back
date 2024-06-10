const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json())
app.use(cors())

app.use(express.static('public'))

//const db = require("./models");

const personneRouter = require("./routes/Personne")
app.use("/personne", personneRouter)

const etudiantRouter = require("./routes/Etudiant")
app.use("/etudiant", etudiantRouter)

const enseignantRouter = require("./routes/Enseignant")
app.use("/enseignant", enseignantRouter)

const moduleRouter = require("./routes/Module")
app.use("/module", moduleRouter)

const matiereRouter = require("./routes/Matiere")
app.use("/matiere", matiereRouter)

const noteRouter = require("./routes/Note")
app.use("/note", noteRouter)

const historiqueNiveauRouter = require("./routes/HistoriqueNiveau")
app.use("/historique-niveau", historiqueNiveauRouter)

// db.sequelize.sync().then(() => {
// });
app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});

//Run app, then load http://localhost:3001 in a browser to see the output.
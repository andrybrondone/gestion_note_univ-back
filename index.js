const express = require('express');
const app = express();
const cors = require('cors');

/*const mysql = require('mysql2')
const multer = require('multer')
const path = require('path')*/

app.use(express.json())
app.use(cors())


/*
app.use(express.static('public'))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
})


app.post('/etudiant', upload.single('photo'), (req, res) => {
  const image = req.file.filename;
  const sql = "update testimg set image = ? where id = 3"
  db.query(sql, [image], (err, result) => {
    if (err) return res.json({ Message: "Error" })
    return res.json({ Status: "success" })
  })
})
app.get('/', (req, res) => {
  const sql = 'select * from testimg'
  db.query(sql, (err, results) => {
    if (err) return res.json("error");
    return res.json(results)
  })
})
app.get('/:id', (req, res) => {
  const id = req.params.id
  const sql = 'select image from testimg where id = ?'
  db.query(sql, [id], (err, results) => {
    if (err) return res.json("error");
    else {
      if (results.length === 0) {
        res.status(404).json({ err: 'itrouvable' })
      } else {
        res.writeHead(200, { 'content-Type': 'image/jpeg' })
        res.end(results[0].image)
      }
    }
  })
})

app.listen(3001, () => {
  console.log('runnn');
})*/




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

// db.sequelize.sync().then(() => {
// });
app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});

//Run app, then load http://localhost:3001 in a browser to see the output.
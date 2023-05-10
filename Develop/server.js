const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const uuidv1 = require("uuid/v1");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  console.log("wooooooooooof");
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// reads the data in the db.json file. Parses the data so it can be used on the dom (meaning viewable on the webpage)
const filePath = path.join(__dirname, "db", "db.json");
app.get("/api/notes", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, notes) => {
    if (err) {
      console.log(err);
      res.status(500).send("Broken");
      return;
    }
    const jsonData = JSON.parse(notes);
    res.json(jsonData);
  });
});

// will have a write file as app.post()
app.post("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(filePath));
  const newNotes = { id: uuidv1(), title: req.body.title, text: req.body.text };
  notes.push(newNotes);
  fs.writeFileSync(filePath, JSON.stringify(notes));
  res.json(newNotes);
});

// for the delete add uuidv1

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

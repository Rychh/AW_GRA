import * as sqlite3 from "sqlite3"; //TODO czy potrzebne?
import express = require('express');

const app = express();
let bodyParser = require('body-parser');
const PORT = 3112;
import * as path from "path"


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// ROUTES
app.use(express.static(path.join(__dirname, '..')));

// SERVER SETUP
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// DATA BASE
// sqlite3.verbose(); TODO potrzebne?
let sql_damian = require('sqlite3').verbose();
let db = new sql_damian.Database('baza.db');

db.getAsync = function (sql) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.get(sql, function (err, row) {
      if (err)
        reject(err);
      else
        resolve(row);
    });
  });
};


db.allAsync = function (sql) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, function (err, row) {
      if (err)
        reject(err);
      else
        resolve(row);
    });
  });
};


app.get('/hello', function (req, res) {
  res.send('hello world');
});

app.get('/database/gameNames', async function (req, res) {
  let cmd = 'SELECT gameName, description FROM game;';
  let result = await db.allAsync(cmd).then((row) => {
    console.log("get /database/gameNames");
    if (row) {
      console.log("OK");
      return row;
    } else {
      console.log("Fail");
      return [];
    }
  });
  res.send(result);
});

app.post('/database/scores', async function (req, res) {
  let gameName = req.body.gameName;
  let cmd = 'SELECT nick, score FROM score_table WHERE gameName="' + gameName + '";';
  let result = await db.allAsync(cmd).then((rows) => {
    console.log("post /database/scores");
    if (rows) {
      console.log("OK");
      return rows;
    } else {
      console.log("Fail");
      return [];
    }
  });
  res.send(result);
});

app.post('/database/state', async function (req, res) {
  let gameName = req.body.gameName;
  let cmd = 'SELECT state FROM game WHERE gameName="' + gameName + '";'; //TODO hmmm...
  let result = await db.getAsync(cmd).then((row) => {
    console.log("post /database/state");
    if (row) {
      console.log("OK");
      return row;
    } else {
      console.log("Fail");
      return ""
    }
  });

});


app.post('/database/addGame', async function (req, res) {
  let gameName = req.body.gameName;
  let description = req.body.description;
  let state = req.body.state;
  let cmd = 'INSERT INTO game (gameName, description, state) VALUES '
    + '(\'' + gameName+'\', \'' + description+'\', \'' + state +'\');';
  try {
    await db.run(cmd);
    res.send("Thank you.");
  } catch (e) {
    res.send("Oh. We have some problems. Please send this later." + e);
  }
});


app.post('/database/addScore', async function (req, res) {
  let gameName = req.body.gameName;
  let nick = req.body.description;
  let score = req.body.state;
  let cmd = 'INSERT INTO score_table (gameName, nick, score) VALUES '
    + '(\'' + gameName+'\', \'' + nick+'\', \'' + score +'\');';
  try {
    await db.run(cmd);
    res.send("Thank you.");
  } catch (e) {
    res.send("Oh. We have some problems. Please send this later." + e); //TODO zmienic powiadomienia
  }
});

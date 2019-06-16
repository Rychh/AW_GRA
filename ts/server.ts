import * as sqlite3 from "sqlite3"; //TODO czy potrzebne?
import express = require('express');

const app = express();
let bodyParser = require('body-parser');
const PORT = 3112;
import * as path from "path"

let users_token = {};
let sample_secret = "A to kanapka pana kota";
let jwt = require('jsonwebtoken');


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

app.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  console.log(req.body);
  if (!req.body.token_check) {
    next();
  } else {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      console.log("token");
      jwt.verify(token, sample_secret, (err, decod) => {
        if (err) {
          res.status(403).json({
            message: "Wrong Token"
          });
        } else {
          console.log("success");
          req.decoded = decod;
          next();
        }
      });
    } else {
      res.status(403).json({
        message: "No Token"
      });
    }
  }
});

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


app.get('/database/gameNames', async function (req, res) {
  let cmd = 'SELECT gameName, description FROM game;';
  let result = await db.allAsync(cmd).then((row) => {
    if (row) {
      console.log("OK /database/gameNames");
      return row;
    } else {
      console.log("Fail /database/gameNames");
      return [];
    }
  });
  res.send(result);
});

app.post('/database/scores', async function (req, res) {
  let gameName = req.body.gameName;
  let cmd = 'SELECT nick, score FROM score_table WHERE gameName="' + gameName + '";';
  let result = await db.allAsync(cmd).then((rows) => {
    if (rows) {
      console.log("OK /database/scores");
      return rows;
    } else {
      console.log("Fail /database/scores");
      return [];
    }
  });
  res.send(result);
});

app.post('/database/state', async function (req, res) {
  let gameName = req.body.gameName;
  let cmd = 'SELECT state FROM game WHERE gameName="' + gameName + '";';
  let result = await db.getAsync(cmd).then((row) => {
    if (row) {
      console.log("OK /database/state");
      return row;
    } else {
      console.log("Fail /database/state");
      return "";
    }
  });
  res.send(result);
});


app.post('/database/addGame', async function (req, res) {
  if (req.body.token_check) {
    let gameName = req.body.gameName;
    let description = req.body.description;
    let state = req.body.state;
    let cmd = 'INSERT INTO game (gameName, description, state) VALUES '
      + '(\'' + gameName + '\', \'' + description + '\', \'' + state + '\');';
    await db.run(cmd, (err) => {
      if (err) {
        res.status(403).json({message: "Oh. We have some problems.\n" + err});
        console.log("Fail /database/addGame" + err);
      } else {
        res.status(200).json({message: "Thank you."});
        console.log("OK /database/addGame");
      }
    });
  } else {
    res.send("Oh. We have problem with your token");
    console.log("Fail Token /database/addGame'");
  }
});


app.post('/database/addScore', async function (req, res) {
  if (req.body.token_check) {
    let nick = req.body.nick;
    let gameName = req.body.gameName;
    let score = parseInt(req.body.score);
    console.log(gameName + " | " + nick + " | " + score);
    let cmd = 'INSERT INTO score_table (gameName, nick, score) VALUES '
      + '(\'' + gameName + '\', \'' + nick + '\', ' + score + ');';
    await db.run(cmd, (err) => {
      if (err) {
        res.send("Oh. We have some problems. Please send this later." + err);
        console.log("Fail /database/addScore'");
      } else {
        res.send("Thank you.");
        console.log("OK /database/addScore'");
      }
    });
  } else {
    res.send("Oh. We have problem with your token");
    console.log("Fail Token /database/addScore'");
  }
});

function check_correctness(nick: string, password: string): boolean {
  return true;
}

app.post('/login', async function (req, res) {

  let nick = req.body.nick;
  let password = req.body.password;
  if (check_correctness(nick, password)) {
    let token = jwt.sign(nick, sample_secret);
    users_token[nick] = token;
    res.status(200).json({
      message: "Login Successful",
      token: token
    });
  } else {
    res.status(403).json({
      message: "Wrong Name or Password"
    });
  }
});

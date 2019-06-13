import * as sqlite3 from 'sqlite3';


function zalozBaze() {

  sqlite3.verbose();

  let db = new sqlite3.Database('baza.db');

  db.run('CREATE TABLE game (' +
    'gameName VARCHAR(255) PRIMARY KEY, ' +
    'description VARCHAR(255), ' +
    'state VARCHAR(65536));'); //TODO

  db.run('CREATE TABLE score_table (' +
    'gameName VARCHAR(255), ' +
    'nick VARCHAR(255),' +
    'score INT' +
    ');');
  db.close();
}

function dodajPodstawowe() {
  sqlite3.verbose();
  let db = new sqlite3.Database('baza.db');
  db.run('INSERT INTO game (gameName, description, state)' +
    ' VALUES ("Base_game", "It is base game.",' +
    '\'{\n' +
    '  "items": [\n' +
    '    "Nuka-Cola",\n' +
    '    "Piasek",\n' +
    '    "Ziemniaki",\n' +
    '    "Złoto"\n' +
    '  ],\n' +
    '  "planets": {\n' +
    '    "Ziemia": {\n' +
    '      "x": 10,\n' +
    '      "y": 10,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 5000,\n' +
    '          "buy_price": 40,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 44,\n' +
    '          "sell_price": 32\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 30000,\n' +
    '          "buy_price": 2900,\n' +
    '          "sell_price": 1500\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 20,\n' +
    '          "buy_price": 399,\n' +
    '          "sell_price": 199\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Mars": {\n' +
    '      "x": 30,\n' +
    '      "y": 10,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 200,\n' +
    '          "buy_price": 45,\n' +
    '          "sell_price": 90\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 30,\n' +
    '          "sell_price": 29\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 150,\n' +
    '          "buy_price": 100,\n' +
    '          "sell_price": 110\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 43,\n' +
    '          "buy_price": 500,\n' +
    '          "sell_price": 400\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "nowy Radom": {\n' +
    '      "x": 25,\n' +
    '      "y": 75,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 30,\n' +
    '          "sell_price": 90\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 1000000,\n' +
    '          "buy_price": 10,\n' +
    '          "sell_price": 15\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 3000,\n' +
    '          "buy_price": 50,\n' +
    '          "sell_price": 60\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 1000,\n' +
    '          "sell_price": 0\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Tleilax": {\n' +
    '      "x": 90,\n' +
    '      "y": 90,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 900,\n' +
    '          "buy_price": 45,\n' +
    '          "sell_price": 50\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 30,\n' +
    '          "sell_price": 45\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 30,\n' +
    '          "buy_price": 100,\n' +
    '          "sell_price": 120\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 1000,\n' +
    '          "buy_price": 100,\n' +
    '          "sell_price": 200\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Arrakis": {\n' +
    '      "x": 95,\n' +
    '      "y": 95,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 100,\n' +
    '          "sell_price": 200\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 500,\n' +
    '          "sell_price": 520\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 500,\n' +
    '          "sell_price": 600\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Seteveder": {\n' +
    '      "x": 70,\n' +
    '      "y": 80,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 200,\n' +
    '          "sell_price": 250\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 100000,\n' +
    '          "buy_price": 50,\n' +
    '          "sell_price": 75\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 500,\n' +
    '          "sell_price": 600\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Kaitain": {\n' +
    '      "x": 80,\n' +
    '      "y": 20,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 3000,\n' +
    '          "buy_price": 60,\n' +
    '          "sell_price": 120\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Krikkit": {\n' +
    '      "x": 65,\n' +
    '      "y": 30,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 350,\n' +
    '          "buy_price": 60,\n' +
    '          "sell_price": 70\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 500,\n' +
    '          "sell_price": 600\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Golgafrincham": {\n' +
    '      "x": 50,\n' +
    '      "y": 55,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 350,\n' +
    '          "buy_price": 60,\n' +
    '          "sell_price": 70\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 100000,\n' +
    '          "buy_price": 50,\n' +
    '          "sell_price": 75\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Traal": {\n' +
    '      "x": 32,\n' +
    '      "y": 45,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 100000,\n' +
    '          "buy_price": 50,\n' +
    '          "sell_price": 75\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 200,\n' +
    '          "sell_price": 250\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 3000,\n' +
    '          "buy_price": 60,\n' +
    '          "sell_price": 120\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 5,\n' +
    '          "buy_price": 500,\n' +
    '          "sell_price": 600\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Vogsphere": {\n' +
    '      "x": 20,\n' +
    '      "y": 90,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 100000,\n' +
    '          "buy_price": 50,\n' +
    '          "sell_price": 75\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Palaven": {\n' +
    '      "x": 30,\n' +
    '      "y": 40,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 350,\n' +
    '          "buy_price": 60,\n' +
    '          "sell_price": 70\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 3000,\n' +
    '          "buy_price": 60,\n' +
    '          "sell_price": 120\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 10,\n' +
    '          "buy_price": 400,\n' +
    '          "sell_price": 520\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Rannoch": {\n' +
    '      "x": 5,\n' +
    '      "y": 64,\n' +
    '      "available_items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 100000,\n' +
    '          "buy_price": 50,\n' +
    '          "sell_price": 75\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 90,\n' +
    '          "sell_price": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 200,\n' +
    '          "sell_price": 250\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 0,\n' +
    '          "buy_price": 200,\n' +
    '          "sell_price": 250\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  },\n' +
    '  "starships": {\n' +
    '    "Rocinante": {\n' +
    '      "x": 65,\n' +
    '      "y": 30,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Kaitain",\n' +
    '      "cargo_hold_size": 250,\n' +
    '      "current_capacity": 40,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 10\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 20\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 10\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "USSR Enterprise ": {\n' +
    '      "x": 50,\n' +
    '      "y": 55,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Golgafrincham",\n' +
    '      "cargo_hold_size": 1000,\n' +
    '      "current_capacity": 120,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 100\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 20\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 0\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Normandy": {\n' +
    '      "x": 32,\n' +
    '      "y": 45,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Traal",\n' +
    '      "cargo_hold_size": 300,\n' +
    '      "current_capacity": 300,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 300\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 0\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Maja": {\n' +
    '      "x": 30,\n' +
    '      "y": 10,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Mars",\n' +
    '      "cargo_hold_size": 200,\n' +
    '      "current_capacity": 200,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 200\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '\n' +
    '    "Meganeura": {\n' +
    '      "x": 10,\n' +
    '      "y": 10,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Ziemia",\n' +
    '      "cargo_hold_size": 120,\n' +
    '      "current_capacity": 30,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 30\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Deneris na smoku": {\n' +
    '      "x": 10,\n' +
    '      "y": 10,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Ziemia",\n' +
    '      "cargo_hold_size": 150,\n' +
    '      "current_capacity": 100,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 100\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 0\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "Heart og Gold": {\n' +
    '      "x": 10,\n' +
    '      "y": 10,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "Ziemia",\n' +
    '      "cargo_hold_size": 140,\n' +
    '      "current_capacity": 5,\n' +
    '      "items": {\n' +
    '        "Nuka-Cola": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Piasek": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Ziemniaki": {\n' +
    '          "available": 5\n' +
    '        },\n' +
    '        "Złoto": {\n' +
    '          "available": 0\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  },\n' +
    '  "game_duration": 120,\n' +
    '  "game_time": 0,\n' +
    '  "game_run": true,\n' +
    '  "initial_credits": 1\n' +
    '}\n' +
    '\');');

  db.run('INSERT INTO game (gameName, description, state)' +
    ' VALUES ("My_life", "MIM is love\n MIM is life",' +
    '\'{\n' +
    '  "items": [\n' +
    '    "Woda",\n' +
    '    "Kawa",\n' +
    '    "Obiad"\n' +
    '  ],\n' +
    '  "planets": {\n' +
    '    "MIM": {\n' +
    '      "x": 40,\n' +
    '      "y": 50,\n' +
    '      "available_items": {\n' +
    '        "Woda": {\n' +
    '          "available": 5000,\n' +
    '          "buy_price": 0,\n' +
    '          "sell_price": 0\n' +
    '        },\n' +
    '        "Kawa": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 5,\n' +
    '          "sell_price": 4\n' +
    '        },\n' +
    '        "Obiad": {\n' +
    '          "available": 30000,\n' +
    '          "buy_price": 15,\n' +
    '          "sell_price": 14\n' +
    '        }\n' +
    '      }\n' +
    '    },\n' +
    '    "DOM": {\n' +
    '      "x": 60,\n' +
    '      "y": 50,\n' +
    '      "available_items": {\n' +
    '        "Woda": {\n' +
    '          "available": 200,\n' +
    '          "buy_price": 0,\n' +
    '          "sell_price": 0\n' +
    '        },\n' +
    '        "Kawa": {\n' +
    '          "available": 100,\n' +
    '          "buy_price": 2,\n' +
    '          "sell_price": 2\n' +
    '        },\n' +
    '        "Obiad": {\n' +
    '          "available": 150,\n' +
    '          "buy_price": 10,\n' +
    '          "sell_price": 9\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  },\n' +
    '  "starships": {\n' +
    '    "Ja": {\n' +
    '      "x": 60,\n' +
    '      "y": 50,\n' +
    '      "timer": 0,\n' +
    '      "inTheSpace": false,\n' +
    '      "position": "DOM",\n' +
    '      "cargo_hold_size": 25,\n' +
    '      "current_capacity": 11,\n' +
    '      "items": {\n' +
    '        "Woda": {\n' +
    '          "available": 10\n' +
    '        },\n' +
    '        "Kawa": {\n' +
    '          "available": 0\n' +
    '        },\n' +
    '        "Obiad": {\n' +
    '          "available": 1\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  },\n' +
    '  "game_duration": 110,\n' +
    '  "game_time": 0,\n' +
    '  "game_run": true,\n' +
    '  "initial_credits": 50\n' +
    '}\n' +
    '\');');
  db.run('INSERT INTO score_table (gameName, nick, score)' +
    ' VALUES ' +
    '("Base_game", "JA", 519), ' +
    '("Base_game", "JA", 1519), ' +
    '("Base_game", "KTOS", 4019), ' +
    '("Base_game", "Ciebiera", 7519), ' +
    '("Base_game", "Azjata", 99999), ' +
    '("My_life", "JA", 51), ' +
    '("My_life", "JA", 151), ' +
    '("My_life", "KTOS", 401), ' +
    '("My_life", "Azjata", 99999), ' +
    '("My_life", "Ciebiera", 751);'
  );


  db.close();

}


function wypiszGameName() {
  sqlite3.verbose();

  let db = new sqlite3.Database('baza.db');


  db.all('SELECT gameName, description, state FROM game;', [], (err, rows) => {

    if (err) throw(err);


    for (let {gameName, description, state} of rows) {

      console.log(gameName, '->', description);

    }

    db.close();

  });
}

// zalozBaze();
// dodajPodstawowe();
wypiszGameName();

// export {dodajPodstawowe, wypiszGameName, zalozBaze};

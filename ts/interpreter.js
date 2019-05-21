// import "./typings"
// import * as data1 from './example.json';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mapComSecond = {};
var mapComOnClick = {};
var nextId = 0;
var gameRun = true;
var gameTrick;
// let game : Game;
var Component = /** @class */ (function () {
    function Component(open, divHeader, divLeft, divRight) {
        this._id = ++nextId;
        mapComSecond[this._id] = this;
        this.open = open;
        this.divHeader = divHeader;
        this.divLeft = divLeft;
        this.divRight = divRight;
    }
    Component.prototype.updateHeader = function (game) {
        if (this.divHeader != null) {
            document.getElementsByTagName(this.divHeader)[0].innerHTML = this.renderHeader(game);
        }
    };
    Component.prototype.updateLeft = function (game) {
        if (this.divLeft != null)
            document.getElementsByTagName(this.divLeft)[0].innerHTML = this.renderLeft(game);
    };
    Component.prototype.updateRight = function (game) {
        if (this.divRight != null)
            document.getElementsByTagName(this.divRight)[0].innerHTML = this.renderRight(game);
    };
    return Component;
}());
var GameMain = /** @class */ (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        var _this = _super.call(this, true, 'game.main.header', 'game.main.left', 'game.main.right') || this;
        _this.divMap = 'game.main.map';
        _this.time = 0;
        return _this;
    }
    GameMain.prototype.renderHeader = function (game) {
        var nickname = window.localStorage.getItem("nickname");
        if (game.game_duration - this.time > 0) {
            return "\n    <h1 id=\"nicknameHeader\"> " + nickname + " </h1>\n    <p class=\"information\">Stan Konta: " + game.initial_credits + " R </p>\n    <p>Czas:  " + (game.game_duration - this.time) + " s</p>\n";
        }
        else {
            return "\n    <h1> " + nickname + " </h1>\n    <div class=\"information\">Wynik: " + game.initial_credits + " R </div>\n    <p>Gamo Over</p>\n";
        }
    };
    GameMain.prototype.generateLeftRow = function (ship, name) {
        return "\n     <tr>\n        <td>\n     " + (!ship.inTheSpace ?
            "<a href=\"#popup\" onclick=\"gamePopupShip.openPopup('" + name + "')\">" :
            "<a href=\"#popup\" onclick=\"gamePopupMovingShip.openPopup('" + name + "')\">") + "\n        " + name + "</a></td>\n        <td>" + ship.current_capacity + "/" + ship.cargo_hold_size + "</td>\n        <td>" + ship.x + "</td>\n        <td>" + ship.y + "</td>\n        <td>" + (ship.inTheSpace ? ship.timer + "s - " : "") + ship.position + "</td>\n      </tr>\n    ";
    };
    GameMain.prototype.generateLeftTable = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.starships).forEach(function (key) {
            result += _this.generateLeftRow(game.starships[key], key);
        });
        return result;
    };
    GameMain.prototype.renderLeft = function (game) {
        return "\n    <h2>Ships:</h2>\n    <table>\n      <thead>\n      <tr>\n        <th>Name</th>\n        <th>Capacity</th>\n        <th>X</th>\n        <th>Y</th>\n        <th>Where</th>\n      </tr>\n      </thead>\n      <tbody>\n      " + this.generateLeftTable(game) + "\n      </tbody>\n    </table>\n";
    };
    GameMain.prototype.generateRightRow = function (planet, name) {
        return "\n     <tr>\n        <td><a href=\"#popup\" onclick=\"gamePopupPlanet.openPopup('" + name + "')\">" + name + "<a></td>\n        <td>" + planet.x + "</td>\n        <td>" + planet.y + "</td>\n      </tr>\n    ";
    };
    GameMain.prototype.generateRightTable = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.planets).forEach(function (key) {
            result += _this.generateRightRow(game.planets[key], key);
        });
        return result;
    };
    GameMain.prototype.renderRight = function (game) {
        return "\n    <h2>Planets:</h2>\n    <table>\n      <thead>\n      <tr>\n        <th>Name</th>\n        <th>X</th>\n        <th>Y</th>\n      </tr>\n      </thead>\n      <tbody>" + this.generateRightTable(game) + "\n      </tbody>\n    </table>\n";
    };
    GameMain.prototype.generateOnePlanet = function (planet, name) {
        return "\n    <circle cx=\"" + planet.x + "%\" cy=\"" + planet.y + "%\" r=\"5\" fill=\"deeppink\" id=\"" + name + "\"\n     href=\"#popup\" onclick=\"gamePopupPlanet.openPopup('" + name + "')\"/>\n  ";
    };
    GameMain.prototype.generateMapOfPlanets = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.planets).forEach(function (key) {
            result += _this.generateOnePlanet(game.planets[key], key);
        });
        return result;
    };
    GameMain.prototype.generateRoad = function (planet1, planet2) {
        return "\n   <line x1=\"" + planet1.x + "%\" y1=\"" + planet1.y + "%\" x2=\"" + planet2.x + "%\" y2=\"" + planet2.y + "%\"\n    style=\"stroke:lightpink;stroke-width:1px\" stroke-dasharray=\"5,5\" d=\"M5 20 l215 0\" />\n  ";
    };
    GameMain.prototype.generateRoads = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.planets).forEach(function (key1) {
            Object.keys(game.planets).forEach(function (key2) {
                if (key1 < key2)
                    result += _this.generateRoad(game.planets[key1], game.planets[key2]);
            });
        });
        return result;
    };
    GameMain.prototype.renderMap = function (game) {
        return "<svg id=\"svgMap\">" + this.generateRoads(game) + this.generateMapOfPlanets(game)
            + "</svg>";
    };
    GameMain.prototype.updateMap = function (game) {
        if (this.divMap != null) {
            document.getElementsByTagName(this.divMap)[0].innerHTML = this.renderMap(game);
            Object.keys(game.starships).forEach(function (key) {
                if (!game.starships[key].inTheSpace)
                    document.getElementById(game.starships[key].position).setAttribute('fill', 'hotpink');
            });
        }
    };
    GameMain.prototype.updateOnClick = function (game) {
        this.updateHeader(game);
        this.updateRight(game);
    };
    GameMain.prototype.updateSecond = function (game) {
        this.updateHeader(game);
        this.updateLeft(game);
    };
    return GameMain;
}(Component));
var GamePopup = /** @class */ (function (_super) {
    __extends(GamePopup, _super);
    function GamePopup() {
        var _this = _super.call(this, false, 'game.popup.header', 'game.popup.left', 'game.popup.right') || this;
        _this.name = "please_set_name";
        return _this;
    }
    GamePopup.prototype.setName = function (name) {
        this.name = name;
    };
    GamePopup.prototype.openPopup = function (name) {
        if (gameRun) {
            Object.keys(mapComSecond).forEach(function (key) {
                if (mapComSecond[key] instanceof GamePopup)
                    mapComSecond[key].open = false;
            });
            this.open = true;
            this.setName(name);
            this.updateHeader(gameTrick);
            this.updateLeft(gameTrick);
            this.updateRight(gameTrick);
        }
    };
    return GamePopup;
}(Component));
var GamePopupPlanet = /** @class */ (function (_super) {
    __extends(GamePopupPlanet, _super);
    function GamePopupPlanet() {
        return _super.call(this) || this;
    }
    GamePopupPlanet.prototype.renderHeader = function (game) {
        return "\n    <h1> " + this.name + " </h1>\n    <p>X:" + game.planets[this.name].x + " Y:" + game.planets[this.name].y + "</p>\n";
    };
    GamePopupPlanet.prototype.generateLeftRow = function (item, name) {
        return "\n     <tr>\n        <td>" + name + "</td>\n        <td>" + item.buy_price + "</td>\n        <td>" + item.sell_price + "</td>\n        <td>" + item.available + "</td>\n      </tr>\n    ";
    };
    GamePopupPlanet.prototype.generateLeftTable = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.planets[this.name].available_items).forEach(function (key) {
            result += _this.generateLeftRow(game.planets[_this.name].available_items[key], key);
        });
        return result;
    };
    GamePopupPlanet.prototype.renderLeft = function (game) {
        return "\n  <h2>Items</h2>\n          <table>\n            <thead>\n            <tr>\n              <th>Name</th>\n              <th>Buy</th>\n              <th>Sell</th>\n              <th>Owned</th>\n            </tr>\n            </thead>\n            <tbody>\n            " + this.generateLeftTable(game) + "\n            </tbody>\n          </table>\n\n";
    };
    GamePopupPlanet.prototype.generateRightRow = function (ship, name) {
        return "\n     <tr>\n        <td><a href=\"#popup\" onclick=\"gamePopupShip.openPopup('" + name + "')\">" + name + "</a></td>\n        <td>" + ship.current_capacity + "/" + ship.cargo_hold_size + "</td>\n      </tr>\n    ";
    };
    GamePopupPlanet.prototype.generateRightTable = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.starships).forEach(function (key) {
            if (!game.starships[key].inTheSpace && game.starships[key].position == _this.name)
                result += _this.generateRightRow(game.starships[key], key);
        });
        return result;
    };
    GamePopupPlanet.prototype.renderRight = function (game) {
        return "<h2>Ships</h2>\n          <table>\n            <thead>\n            <tr>\n              <th>Name</th>\n              <th>Capacity</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n              " + this.generateRightTable(game) + "\n            </tr>\n            </tbody>";
    };
    GamePopupPlanet.prototype.updateSecond = function (game) {
        this.updateRight(game);
    };
    GamePopupPlanet.prototype.updateOnClick = function (game) {
        this.updateRight(game);
        this.updateLeft(game);
        this.updateHeader(game);
    };
    return GamePopupPlanet;
}(GamePopup));
var GamePopupShip = /** @class */ (function (_super) {
    __extends(GamePopupShip, _super);
    function GamePopupShip() {
        return _super.call(this) || this;
    }
    GamePopupShip.prototype.distance = function (ship, planet) {
        return Math.ceil(Math.sqrt((ship.x - planet.x) * (ship.x - planet.x) +
            (ship.y - planet.y) * (ship.y - planet.y)));
    };
    GamePopupShip.prototype.move = function (time, planetName) {
        var planet = gameTrick.planets[planetName];
        var lastPlanetName = gameTrick.starships[this.name].position;
        addAnimation(gameTrick.starships[this.name], this.name, planet, time);
        gameTrick.starships[this.name].position = planetName;
        gameTrick.starships[this.name].inTheSpace = true;
        gameTrick.starships[this.name].timer = time;
        gameTrick.starships[this.name].x = planet.x;
        gameTrick.starships[this.name].y = planet.y;
        var planetColor = "deeppink";
        Object.keys(gameTrick.starships).forEach(function (key) {
            if (!gameTrick.starships[key].inTheSpace && gameTrick.starships[key].position == lastPlanetName)
                planetColor = "hotpink";
        });
        document.getElementById(lastPlanetName).setAttribute('fill', planetColor);
        gamePopupMovingShip.openPopup(this.name);
    };
    GamePopupShip.prototype.renderHeader = function (game) {
        return "\n    <h1> " + this.name + " </h1>\n    <p>Cap: " + game.starships[this.name].current_capacity + "/" + game.starships[this.name].cargo_hold_size + "</p>\n    <p>X:" + game.starships[this.name].x + " Y:" + game.starships[this.name].y + "</p>\n";
    };
    GamePopupShip.prototype.generateLeftRow = function (item, ship, name) {
        return "\n     <tr>\n        <td>" + name + "</td>\n        <td>" + item.buy_price + "</td>\n        <td>" + item.sell_price + "</td>\n        <td>" + item.available + "</td>\n        <td>" + ship.items[name].available + "</td>\n        <td><input type=\"number\" id=\"" + name + "\" value=\"0\"></td>\n      </tr>\n    ";
    };
    GamePopupShip.prototype.generateLeftTable = function (game) {
        var _this = this;
        var result = "";
        var planetName = game.starships[this.name].position;
        Object.keys(game.planets[planetName].available_items).forEach(function (key) {
            result += _this.generateLeftRow(game.planets[planetName].available_items[key], game.starships[_this.name], key);
        });
        return result;
    };
    GamePopupShip.prototype.renderLeft = function (game) {
        return "\n  <h2>~" + game.starships[this.name].position + "~</h2>\n     <form action=\"\">\n          <table>\n            <thead>\n            <tr>\n              <th>Name</th>\n              <th>Buy</th>\n              <th>Sell</th>\n              <th>Owned</th>\n              <th>Statkowe</th>\n            </tr>\n            </thead>\n            <tbody>\n            " + this.generateLeftTable(game) + "\n            </tbody>\n          </table>\n      <button  onclick=\"checker()\">Submit</button>\n      </form>\n\n";
    };
    GamePopupShip.prototype.generateRightRow = function (planet, ship, name) {
        var time = this.distance(ship, planet);
        return "\n     <tr>\n        <td><a href=\"#popup\" onclick=\"gamePopupPlanet.openPopup('" + name + "')\">" + name + "</a></td>\n        <td>" + planet.x + "</td>\n        <td>" + planet.y + "</td>\n        <td>" + time + "</td>\n        <td><button onclick=\"gamePopupShip.move(" + time + ",'" + name + "')\">LE\u0106</button></td>\n      </tr>\n    ";
    };
    GamePopupShip.prototype.generateRightTable = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.planets).forEach(function (key) {
            if (key != game.starships[_this.name].position)
                result += _this.generateRightRow(game.planets[key], game.starships[_this.name], key);
        });
        return result;
    };
    GamePopupShip.prototype.renderRight = function (game) {
        return "<h2>Planets</h2>\n          <table>\n            <thead>\n            <tr>\n              <th>Name</th>\n              <th>X</th>\n              <th>Y</th>\n              <th>Time</th>\n              <th>Choose</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n              " + this.generateRightTable(game) + "\n            </tr>\n            </tbody>";
    };
    GamePopupShip.prototype.updateSecond = function (game) {
        this.updateRight(game);
    };
    GamePopupShip.prototype.updateOnClick = function (game) {
        this.updateRight(game);
        this.updateLeft(game);
        this.updateHeader(game);
    };
    return GamePopupShip;
}(GamePopup));
var GamePopupMovingShip = /** @class */ (function (_super) {
    __extends(GamePopupMovingShip, _super);
    function GamePopupMovingShip() {
        return _super.call(this) || this;
    }
    GamePopupMovingShip.prototype.renderHeader = function (game) {
        return "\n    <h1> " + this.name + " dasdsa</h1>\n    <p>Cap: " + game.starships[this.name].current_capacity + "/" + game.starships[this.name].cargo_hold_size + "</p>\n    <p>X:" + game.starships[this.name].x + " Y:" + game.starships[this.name].y + "</p>\n";
    };
    GamePopupMovingShip.prototype.generateLeftRow = function (item, name) {
        return "\n     <tr>\n        <td>" + name + "</td>\n        <td>" + item.available + "</td>\n      </tr>\n    ";
    };
    GamePopupMovingShip.prototype.generateLeftTable = function (game) {
        var _this = this;
        var result = "";
        Object.keys(game.starships[this.name].items).forEach(function (key) {
            result += _this.generateLeftRow(game.starships[_this.name].items[key], key);
        });
        return result;
    };
    GamePopupMovingShip.prototype.renderLeft = function (game) {
        return "\n  <h2>Your Items</h2>\n          <table>\n            <thead>\n            <tr>\n              <th>Name</th>\n              <th>Statkowe</th>\n            </tr>\n            </thead>\n            <tbody>\n            " + this.generateLeftTable(game) + "\n            </tbody>\n          </table>\n\n";
    };
    GamePopupMovingShip.prototype.renderRight = function (game) {
        var planetName = game.starships[this.name].position;
        return "<h2>Moving</h2>\n         <h3>\n            Dotrzesz do <a href=\"#popup\" onclick=\"gamePopupPlanet.openPopup('" + planetName + "')\"> " + planetName + "</a><!--\n      -->  za " + game.starships[this.name].timer + "s.\n          </h3>\n";
    };
    GamePopupMovingShip.prototype.updateSecond = function (game) {
        this.updateRight(game);
    };
    GamePopupMovingShip.prototype.updateOnClick = function (game) {
        this.updateRight(game);
        this.updateLeft(game);
        this.updateHeader(game);
    };
    return GamePopupMovingShip;
}(GamePopup));
var GamePopupGameOver = /** @class */ (function (_super) {
    __extends(GamePopupGameOver, _super);
    function GamePopupGameOver() {
        return _super.call(this) || this;
    }
    GamePopupGameOver.prototype.renderHeader = function (game) {
        return "";
    };
    GamePopupGameOver.prototype.renderLeft = function (game) {
        return "\n    <h1> Game Over </h1>\n  <h2>Score: " + game.initial_credits + "</h2>  \n  <button onclick=\"goToIndex()\">Menu</button>\n";
    };
    GamePopupGameOver.prototype.renderRight = function (game) {
        return "";
    };
    GamePopupGameOver.prototype.updateSecond = function (game) {
        this.updateRight(game);
    };
    GamePopupGameOver.prototype.updateOnClick = function (game) {
        this.updateRight(game);
        this.updateLeft(game);
        this.updateHeader(game);
    };
    return GamePopupGameOver;
}(GamePopup));
var gameMain = new GameMain();
var gamePopupPlanet = new GamePopupPlanet();
var gamePopupShip = new GamePopupShip();
var gamePopupMovingShip = new GamePopupMovingShip();
var gamePopupGameOver = new GamePopupGameOver();
// Increase or decrease every timer
function timeUpdate(game) {
    if (gameRun) {
        gameMain.time++;
        if (gameTrick.game_duration <= gameMain.time) {
            gamePopupGameOver.openPopup('');
            gameRun = false;
        }
        Object.keys(game.starships).forEach(function (key) {
            if (game.starships[key].inTheSpace) {
                game.starships[key].timer--;
                if (game.starships[key].timer <= 0) {
                    game.starships[key].inTheSpace = false;
                    document.getElementById("svgMap").removeChild(document.getElementById(key));
                    document.getElementById(game.starships[key].position).setAttribute('fill', 'hotpink');
                    if (gamePopupMovingShip.open && gamePopupMovingShip.name == key) {
                        gamePopupShip.openPopup(key);
                    }
                }
            }
        });
    }
}
function updateAll(onClick, game) {
    Object.keys(mapComSecond).forEach(function (key) {
        if (mapComSecond[key].open) {
            if (onClick) {
                mapComSecond[key].updateOnClick(game);
            }
            else {
                mapComSecond[key].updateSecond(game);
            }
        }
    });
}
// Every 1 sec updateLeft everything
function oneSecUpdate(game) {
    timeUpdate(game);
    updateAll(false, game);
    // gameMain.addAnimation();//game.starships["Maja"], game.planets["Tleilax"], 9);
    setTimeout(oneSecUpdate, 1000, game);
}
function dzik(game) {
    gameTrick = game;
    console.log(game);
    gameMain.updateHeader(game);
    gameMain.updateLeft(game);
    gameMain.updateRight(game);
    gameMain.updateMap(game);
    // addAnimation();
    var elementsArray = document.querySelectorAll("circle");
    elementsArray.forEach(function (elem) {
        elem.addEventListener("click", function (ev) {
            gamePopupPlanet.openPopup(elem.id);
            window.location.href = "#popup";
        });
    });
    updateAll(true, game);
    oneSecUpdate(game);
}
fetch("../json/game.json")
    .then(function (resp) {
    return resp.json();
}).then(function (json) {
    return json;
}).then(dzik);
function goToIndex() {
    window.location.href = "index.html";
}
function addAnimation(ship, shipName, planet, time) {
    var svg = document.getElementById("svgMap");
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    element.setAttribute("points", "0,-5 15,0 0,5");
    element.setAttribute("style", "fill:violet;stroke:darkviolet;stroke-width:1");
    element.id = shipName;
    var animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animation.setAttribute("path", "M" + 3 * ship.x + " " + 3 * ship.y + "  L" + 3 * planet.x + " " + 3 * planet.y);
    animation.setAttribute("begin", gameMain.time + "s");
    animation.setAttribute("dur", time + "s");
    animation.setAttribute("rotate", "auto");
    element.appendChild(animation);
    svg.appendChild(element);
}
function checkTheCorrectness(planetName, planet, shipName, ship, items, balance, base) {
    var newCap = 0;
    var money = 0;
    for (var i = 0; i < balance.length; i++) {
        var item = items[i];
        if (planet.available_items[item].available - balance[i] < 0)
            throw new Error(planetName + " don't have enough " + item);
        if (ship.items[item].available + balance[i] < 0)
            throw new Error(shipName + " don't have enough " + item);
        if (balance[i] >= 0)
            money -= balance[i] * planet.available_items[item].buy_price;
        else
            money += -balance[i] * planet.available_items[item].sell_price;
        newCap += balance[i] + ship.items[item].available;
    }
    if (+money < 0)
        throw new Error("You don't have enough money. You need " + money + " R more.");
    if (newCap > ship.cargo_hold_size)
        throw new Error(shipName + " don't have enough capacity.");
}
function changeValue(planet, ship, items, balance) {
    var money = 0;
    for (var i = 0; i < balance.length; i++) {
        var item = gameTrick.items[i];
        planet.available_items[item].available -= balance[i];
        ship.items[item].available += balance[i];
        ship.current_capacity += balance[i];
        if (balance[i] >= 0)
            money -= balance[i] * planet.available_items[item].buy_price;
        else
            money += -balance[i] * planet.available_items[item].sell_price;
    }
    return money;
}
function checker() {
    var balance = [];
    var money = 0;
    var correctActrion = gameRun;
    var ship = gameTrick.starships[gamePopupShip.name];
    var planet = gameTrick.planets[ship.position];
    var x;
    for (var i = 0; i < gameTrick.items.length; i++) {
        // @ts-ignore
        x = Number(document.getElementById(gameTrick.items[i]).value);
        if (isNaN(x))
            correctActrion = false;
        balance.push(x);
    }
    try {
        checkTheCorrectness(ship.position, planet, gamePopupShip.name, ship, gameTrick.items, balance, gameTrick.initial_credits);
        gameTrick.initial_credits += changeValue(planet, ship, gameTrick.items, balance);
        updateAll(true, gameTrick);
    }
    catch (e) {
        console.log(e);
    }
}
var tests = [];
var testNextId = 0;
var ItemPlanetClass = /** @class */ (function () {
    function ItemPlanetClass(available, buy_price, sell_price) {
        this.available = available;
        this.buy_price = buy_price;
        this.sell_price = sell_price;
    }
    return ItemPlanetClass;
}());
var PlanetClass = /** @class */ (function () {
    function PlanetClass(item) {
        this.available_items = {};
        this.x = 0;
        this.y = 0;
        this.available_items[item] = new ItemPlanetClass(0, 0, 0);
    }
    return PlanetClass;
}());
var ItemShipClass = /** @class */ (function () {
    function ItemShipClass(available) {
        this.available = available;
    }
    return ItemShipClass;
}());
var ShipClass = /** @class */ (function () {
    function ShipClass(item, position) {
        this.x = 0;
        this.y = 0;
        this.timer = 0;
        this.inTheSpace = false;
        this.position = "";
        this.cargo_hold_size = 0;
        this.current_capacity = 0;
        this.items = {};
        this.items[item] = new ItemShipClass(0);
    }
    return ShipClass;
}());
var LogicalTest = /** @class */ (function () {
    function LogicalTest(name, item) {
        this.items = [];
        this.balance = [];
        this.id = ++testNextId;
        tests[this.id] = this;
        this.name = name;
        this.planetName = "TestPlanet_" + this.id;
        this.shipName = "TestShip_" + this.id;
        this.items = [];
        this.items.push(item);
        this.planet = new PlanetClass(item);
        this.ship = new ShipClass(item, this.planetName);
        this.balance[item] = 0;
    }
    LogicalTest.prototype.start = function () {
        console.log("Start Test " + this.id + " " + this.name);
        try {
            this.test();
            console.log("Correct End Test " + this.id);
        }
        catch (e) {
            console.log("Upsik?!?! Coś poszło nie tak!");
            console.log(e);
            throw e;
        }
    };
    LogicalTest.prototype.errorMessageShip = function (item) {
        return this.shipName + " don't have enough " + item;
    };
    LogicalTest.prototype.errorMessagePlanet = function (item) {
        return this.planetName + " don't have enough " + item;
    };
    LogicalTest.prototype.errorMessageMoney = function (money) {
        return "You don't have enough money. You need " + money + " R more.";
    };
    LogicalTest.prototype.errorMessageCap = function () {
        return this.shipName + " don't have enough capacity.";
    };
    return LogicalTest;
}());
var TestBrakZiemniakow = /** @class */ (function (_super) {
    __extends(TestBrakZiemniakow, _super);
    function TestBrakZiemniakow() {
        return _super.call(this, "Brak Ziemniakow", "Ziemniak") || this;
    }
    TestBrakZiemniakow.prototype.test = function () {
        var item = "Ziemniak";
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
        }
        catch (e) {
            throw new Error("Pusty test" + e);
        }
        this.ship.cargo_hold_size = 1;
        this.balance[item] = 1;
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
            throw new Error("Nie powinno być możliwości kupna");
        }
        catch (e) {
            if (this.errorMessagePlanet(item) != e) {
                throw new Error("Inny error1" + e);
            }
        }
        this.balance[item] = -1;
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
            throw new Error("Nie powinno być możliwości sprzedaży");
        }
        catch (e) {
            if (this.errorMessageShip(item) != e) {
                throw new Error("Inny error2 " + e);
            }
        }
        this.ship.items[item].available = 1;
        this.ship.current_capacity = 1;
        this.planet.available_items[item].sell_price = 1;
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
            if (changeValue(this.planet, this.ship, this.items, this.balance) != 1)
                throw new Error("Hajs sie nie zgadza");
            if (this.ship.items[item].available != 0)
                throw new Error("Ilość przedmiotów sie nie zgadza");
            if (this.ship.current_capacity != 0)
                throw new Error("Statek nie powinien nic miec");
            if (this.planet.available_items[item].available != 0)
                throw new Error("Na planecie powinno byc wiece itemow");
        }
        catch (e) {
            throw new Error("Problem z sprzedażą " + e);
        }
    };
    return TestBrakZiemniakow;
}(LogicalTest));
var TestBrakHajsow = /** @class */ (function (_super) {
    __extends(TestBrakHajsow, _super);
    function TestBrakHajsow() {
        return _super.call(this, "Brak Pieniedzy", "Ziemniak") || this;
    }
    TestBrakHajsow.prototype.test = function () {
        var item = "Ziemniak";
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
        }
        catch (e) {
            throw new Error("Pusty test" + e);
        }
        this.balance[item] = 1;
        this.ship.cargo_hold_size = 1;
        this.planet.available_items[item].buy_price = 1;
        this.planet.available_items[item].available = 1;
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
        }
        catch (e) {
            if (this.errorMessageMoney(-1) != e) {
                throw new Error("Inny error1" + e);
            }
        }
        this.ship.items[item].available = -1;
        try {
            checkTheCorrectness(this.planetName, this.planet, this.shipName, this.ship, this.items, this.balance, 0);
        }
        catch (e) {
            if (this.errorMessageShip(item) != e) {
                throw new Error("Inny error2 " + e);
            }
        }
    };
    return TestBrakHajsow;
}(LogicalTest));

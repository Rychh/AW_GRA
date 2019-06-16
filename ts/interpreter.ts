// import "./typings"
// import * as data1 from './example.json';


interface ItemPlanet {
  available: number;
  buy_price: number;
  sell_price: number;
}

interface Planet {
  x: number;
  y: number;
  available_items: {
    [key: string]: ItemPlanet
  };
}

interface ItemShip {
  available: number;
}

interface Ship {
  x: number;
  y: number;
  timer: number;
  inTheSpace: boolean;
  position: string;
  cargo_hold_size: number;
  current_capacity: number;
  items: {
    [key: string]: ItemShip
  };
}

interface Game {
  items: string[];

  planets: {
    [name: string]: Planet
  }

  starships: {
    [name: string]: Ship
  }

  game_duration: number;
  game_time: number;
  game_run: boolean;
  initial_credits: number;
}

interface IComponent {
  divHeader: string;
  divLeft: string;
  divRight: string;
  _id: number;
  open: boolean;

  renderLeft(game: Game): string;

  renderRight(game: Game): string;

  renderHeader(game: Game): string;

  updateHeader(game: Game): void;

  updateLeft(game: Game): void;

  updateRight(game: Game): void;

  updateSecond(game: Game): void;

  updateOnClick(game: Game): void;
}


let mapComSecond: { [id: string]: IComponent } = {};
let mapComOnClick: { [id: string]: IComponent } = {};
let nextId = 0;
let gameTrick: Game;
let pageTime = 0;

// let game : Game;

abstract class Component implements IComponent {
  divHeader: string;
  divLeft: string;
  divRight: string;
  _id: number;
  open: boolean;

  protected constructor(open: boolean, divHeader: string,
                        divLeft: string, divRight: string) {
    this._id = ++nextId;
    mapComSecond[this._id] = this;
    this.open = open;
    this.divHeader = divHeader;
    this.divLeft = divLeft;
    this.divRight = divRight;
  }

  abstract renderRight(game: Game): string;

  abstract renderLeft(game: Game): string;

  abstract renderHeader(game: Game): string;

  abstract updateSecond(game: Game): void;

  abstract updateOnClick(game: Game): void;

  updateHeader(game: Game) {
    if (this.divHeader != null) {
      document.getElementsByTagName(this.divHeader)[0].innerHTML = this.renderHeader(game);
    }
  }

  updateLeft(game: Game) {
    if (this.divLeft != null)
      document.getElementsByTagName(this.divLeft)[0].innerHTML = this.renderLeft(game);
  }

  updateRight(game: Game) {
    if (this.divRight != null)
      document.getElementsByTagName(this.divRight)[0].innerHTML = this.renderRight(game);
  }
}

class GameMain extends Component {
  divMap: string;

  constructor() {
    super(true, 'game.main.header', 'game.main.left', 'game.main.right');
    this.divMap = 'game.main.map'
  }

  renderHeader(game: Game): string {
    let nickname = window.localStorage.getItem("nickname");

    if (game.game_duration - game.game_time > 0) {
      return `
    <h1 id="nicknameHeader"> ${nickname} </h1>
    <p id="konto">Stan Konta: ${game.initial_credits} R </p>
    <p>Czas:  ${game.game_duration - game.game_time} s</p>
`;
    } else {
      return `
    <h1> ${nickname} </h1>
    <div class="information">Wynik: ${game.initial_credits} R </div>
    <p>Gamo Over</p>
`;
    }
  }


  generateLeftRow(ship: Ship, name: string): string {
    return `
     <tr>
        <td>
     ${!ship.inTheSpace ?
      `<a href="#popup" onclick="gamePopupShip.openPopup('${name}')">` :
      `<a href="#popup" onclick="gamePopupMovingShip.openPopup('${name}')">`}
        ${name}</a></td>
        <td>${ship.current_capacity}/${ship.cargo_hold_size}</td>
        <td>${ship.x}</td>
        <td>${ship.y}</td>
        <td>${ship.inTheSpace ? `${ship.timer}s - ` : ``}${ship.position}</td>
      </tr>
    `
  }

  generateLeftTable(game: Game): string {
    let result: string = "";
    Object.keys(game.starships).forEach(key => {
      result += this.generateLeftRow(game.starships[key], key);
    });
    return result;
  }

  renderLeft(game: Game): string {
    return `
    <h2>Ships:</h2>
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Capacity</th>
        <th>X</th>
        <th>Y</th>
        <th>Where</th>
      </tr>
      </thead>
      <tbody>
      ` + this.generateLeftTable(game) + `
      </tbody>
    </table>
`;
  }

  generateRightRow(planet: Planet, name: string): string {
    return `
     <tr>
        <td><a href="#popup" onclick="gamePopupPlanet.openPopup('${name}')">${name}<a></td>
        <td>${planet.x}</td>
        <td>${planet.y}</td>
      </tr>
    `
  }

  generateRightTable(game: Game): string {
    let result: string = "";
    Object.keys(game.planets).forEach(key => {
      result += this.generateRightRow(game.planets[key], key);
    });
    return result;
  }

  renderRight(game: Game): string {
    return `
    <h2>Planets:</h2>
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>X</th>
        <th>Y</th>
      </tr>
      </thead>
      <tbody>` + this.generateRightTable(game) + `
      </tbody>
    </table>
`;
  }

  generateOnePlanet(planet: Planet, name: string) {
    return `
    <circle cx="${planet.x}%" cy="${planet.y}%" r="5" fill="deeppink" id="${name}"
     href="#popup" onclick="gamePopupPlanet.openPopup('${name}')"/>
  `;
  }

  generateMapOfPlanets(game: Game) {
    let result: string = "";
    Object.keys(game.planets).forEach(key => {
      result += this.generateOnePlanet(game.planets[key], key);
    });
    return result;
  }

  generateRoad(planet1: Planet, planet2: Planet) {
    return `
   <line x1="${planet1.x}%" y1="${planet1.y}%" x2="${planet2.x}%" y2="${planet2.y}%"
    style="stroke:lightpink;stroke-width:1px" stroke-dasharray="5,5" d="M5 20 l215 0" />
  `;
  }

  generateRoads(game: Game) {
    let result: string = "";
    Object.keys(game.planets).forEach(key1 => {
      Object.keys(game.planets).forEach(key2 => {
        if (key1 < key2)
          result += this.generateRoad(game.planets[key1], game.planets[key2]);
      });
    });
    return result;
  }

  renderMap(game: Game): string {


    return `<svg id="svgMap">` + this.generateRoads(game) + this.generateMapOfPlanets(game)
      + `</svg>`;
  }


  updateMap(game: Game) {
    if (this.divMap != null) {
      document.getElementsByTagName(this.divMap)[0].innerHTML = this.renderMap(game);
      Object.keys(game.starships).forEach(key => {
        if (!game.starships[key].inTheSpace)
          document.getElementById(game.starships[key].position).setAttribute('fill', 'hotpink');
      });
    }
  }

  updateOnClick(game: Game): void {
    this.updateHeader(game);
    this.updateRight(game);
  }

  updateSecond(game: Game): void {
    this.updateHeader(game);
    this.updateLeft(game);
  }

}

abstract class GamePopup extends Component {
  name: string;

  constructor() {
    super(false, 'game.popup.header', 'game.popup.left', 'game.popup.right');
    this.name = "please_set_name";
  }

  setName(name: string): void {
    this.name = name;
  }

  openPopup(name: string): void {
    if (gameTrick.game_run) {
      Object.keys(mapComSecond).forEach(key => {
        if (mapComSecond[key] instanceof GamePopup)
          mapComSecond[key].open = false;
      });
      this.open = true;
      this.setName(name);
      this.updateHeader(gameTrick);
      this.updateLeft(gameTrick);
      this.updateRight(gameTrick);
    }
  }
}

class GamePopupPlanet extends GamePopup {

  constructor() {
    super();
  }

  renderHeader(game: Game): string {
    return `
    <h1> ${this.name} </h1>
    <p>X:${game.planets[this.name].x} Y:${game.planets[this.name].y}</p>
`;
  }


  generateLeftRow(item: ItemPlanet, name: string): string {
    return `
     <tr>
        <td>${name}</td>
        <td>${item.buy_price}</td>
        <td>${item.sell_price}</td>
        <td>${item.available}</td>
      </tr>
    `
  }

  generateLeftTable(game: Game): string {
    let result: string = "";
    Object.keys(game.planets[this.name].available_items).forEach(key => {
      result += this.generateLeftRow(game.planets[this.name].available_items[key], key);
    });
    return result;
  }

  renderLeft(game: Game): string {
    return `
  <h2>Items</h2>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>Owned</th>
            </tr>
            </thead>
            <tbody>
            ` + this.generateLeftTable(game) + `
            </tbody>
          </table>

`;
  }

  generateRightRow(ship: Ship, name: string): string {
    return `
     <tr>
        <td><a id="${name}Link"  href="#popup" onclick="gamePopupShip.openPopup('${name}')">${name}</a></td>
        <td>${ship.current_capacity}/${ship.cargo_hold_size}</td>
      </tr>
    `
  }

  generateRightTable(game: Game): string {
    let result: string = "";
    Object.keys(game.starships).forEach(key => {
      if (!game.starships[key].inTheSpace && game.starships[key].position == this.name)
        result += this.generateRightRow(game.starships[key], key);
    });
    return result;
  }

  renderRight(game: Game): string {
    return `<h2>Ships</h2>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              ` + this.generateRightTable(game) + `
            </tr>
            </tbody>`;
  }

  updateSecond(game: Game): void {
    this.updateRight(game);
  }

  updateOnClick(game: Game): void {
    this.updateRight(game);
    this.updateLeft(game);
    this.updateHeader(game);
  }
}


class GamePopupShip extends GamePopup {

  constructor() {
    super();
  }

  distance(ship: Ship, planet: Planet): number {
    return Math.ceil(Math.sqrt((ship.x - planet.x) * (ship.x - planet.x) +
      (ship.y - planet.y) * (ship.y - planet.y)));
  }

  move(time: number, planetName: string): void {
    let planet = gameTrick.planets[planetName];
    let lastPlanetName = gameTrick.starships[this.name].position;
    addAnimation(gameTrick.starships[this.name], this.name, planet, time);
    gameTrick.starships[this.name].position = planetName;
    gameTrick.starships[this.name].inTheSpace = true;
    gameTrick.starships[this.name].timer = time;
    gameTrick.starships[this.name].x = planet.x;
    gameTrick.starships[this.name].y = planet.y;

    let planetColor = "deeppink";
    Object.keys(gameTrick.starships).forEach(key => {
      if (!gameTrick.starships[key].inTheSpace && gameTrick.starships[key].position == lastPlanetName)
        planetColor = "hotpink";
    });
    document.getElementById(lastPlanetName).setAttribute('fill', planetColor);

    gamePopupMovingShip.openPopup(this.name);
  }

  renderHeader(game: Game): string {
    return `
    <h1> ${this.name} </h1>
    <p>Cap: ${game.starships[this.name].current_capacity}/${game.starships[this.name].cargo_hold_size}</p>
    <p>X:${game.starships[this.name].x} Y:${game.starships[this.name].y}</p>
`;
  }


  generateLeftRow(item: ItemPlanet, ship: Ship, name: string): string {
    return `
     <tr>
        <td>${name}</td>
        <td>${item.buy_price}</td>
        <td>${item.sell_price}</td>
        <td>${item.available}</td>
        <td>${ship.items[name].available}</td>
        <td><input type="number" id="${name}" value="0"></td>
      </tr>
    `
  }

  generateLeftTable(game: Game): string {
    let result: string = "";
    let planetName: string = game.starships[this.name].position;
    Object.keys(game.planets[planetName].available_items).forEach(key => {
      result += this.generateLeftRow(game.planets[planetName].available_items[key], game.starships[this.name], key);
    });
    return result;
  }

  renderLeft(game: Game): string {
    return `
  <h2>~${game.starships[this.name].position}~</h2>
     <form action="">
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>Owned</th>
              <th>Statkowe</th>
            </tr>
            </thead>
            <tbody>
            ` + this.generateLeftTable(game) + `
            </tbody>
          </table>
      <button  onclick="checker()">Submit</button>
      </form>

`;
  }

  generateRightRow(planet: Planet, ship: Ship, name: string): string {
    let time: number = this.distance(ship, planet);
    return `
     <tr>
        <td><a href="#popup" onclick="gamePopupPlanet.openPopup('${name}')">${name}</a></td>
        <td>${planet.x}</td>
        <td>${planet.y}</td>
        <td>${time}</td>
        <td><button onclick="gamePopupShip.move(${time},'${name}')">LEĆ</button></td>
      </tr>
    `
  }

  generateRightTable(game: Game): string {
    let result: string = "";
    Object.keys(game.planets).forEach(key => {
      if (key != game.starships[this.name].position)
        result += this.generateRightRow(game.planets[key], game.starships[this.name], key);
    });
    return result;
  }

  renderRight(game: Game): string {
    return `<h2>Planets</h2>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>X</th>
              <th>Y</th>
              <th>Time</th>
              <th>Choose</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              ` + this.generateRightTable(game) + `
            </tr>
            </tbody>`;
  }

  updateSecond(game: Game): void {
    this.updateRight(game);
  }

  updateOnClick(game: Game): void {
    this.updateRight(game);
    this.updateLeft(game);
    this.updateHeader(game);
  }
}

class GamePopupMovingShip extends GamePopup {

  constructor() {
    super();
  }

  renderHeader(game: Game): string {
    return `
    <h1> ${this.name} dasdsa</h1>
    <p>Cap: ${game.starships[this.name].current_capacity}/${game.starships[this.name].cargo_hold_size}</p>
    <p>X:${game.starships[this.name].x} Y:${game.starships[this.name].y}</p>
`;
  }


  generateLeftRow(item: ItemShip, name: string): string {
    return `
     <tr>
        <td>${name}</td>
        <td>${item.available}</td>
      </tr>
    `
  }

  generateLeftTable(game: Game): string {
    let result: string = "";
    Object.keys(game.starships[this.name].items).forEach(key => {
      result += this.generateLeftRow(game.starships[this.name].items[key], key);
    });
    return result;
  }

  renderLeft(game: Game): string {
    return `
  <h2>Your Items</h2>
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Statkowe</th>
            </tr>
            </thead>
            <tbody>
            ` + this.generateLeftTable(game) + `
            </tbody>
          </table>

`;
  }

  renderRight(game: Game): string {
    let planetName: string = game.starships[this.name].position;
    return `<h2>Moving</h2>
         <h3>
            Dotrzesz do <a href="#popup" onclick="gamePopupPlanet.openPopup('${planetName}')"> ${planetName}</a><!--
      -->  za ${game.starships[this.name].timer}s.
          </h3>
`;
  }

  updateSecond(game: Game): void {
    this.updateRight(game);
  }

  updateOnClick(game: Game): void {
    this.updateRight(game);
    this.updateLeft(game);
    this.updateHeader(game);
  }
}

class GamePopupGameOver extends GamePopup {

  constructor() {
    super();
  }

  renderHeader(game: Game): string {
    return ``;
  }

  renderLeft(game: Game): string {
    return `
    <h1> Game Over </h1>
  <h2>Score: ${game.initial_credits}</h2>  
  <button onclick="goToIndex()">Menu</button>
`;
  }

  renderRight(game: Game): string {
    return ``;
  }

  updateSecond(game: Game): void {
    this.updateRight(game);
  }

  updateOnClick(game: Game): void {
    this.updateRight(game);
    this.updateLeft(game);
    this.updateHeader(game);
  }
}


let gameMain = new GameMain();
let gamePopupPlanet = new GamePopupPlanet();
let gamePopupShip = new GamePopupShip();
let gamePopupMovingShip = new GamePopupMovingShip();
let gamePopupGameOver = new GamePopupGameOver();

// Increase or decrease every timer
function timeUpdate(game: Game) {
  if (game.game_run) {
    pageTime++;
    game.game_time++;
    if (gameTrick.game_duration <= game.game_time) {
      gamePopupGameOver.openPopup('');
      game.game_run = false;

      let nick = window.localStorage.getItem("nickname");
      let gameName = window.localStorage.getItem("gameName");
      let score = game.initial_credits;
      let token = window.localStorage.getItem("token");

      fetch('/database/addScore', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          token: token,
          token_check: true,
          nick: nick,
          gameName: gameName,
          score: score
        }),
      })
        .then(response => console.log(response)); // parses JSON response into native Javascript objects
    }
  }

  Object.keys(game.starships).forEach(key => {
    if (game.starships[key].inTheSpace) {
      game.starships[key].timer--;
      if (game.starships[key].timer <= 0) {
        game.starships[key].inTheSpace = false;
        try {
          document.getElementById("svgMap").removeChild(document.getElementById(key));
        } catch (e) {
          console.log("Upsik. Zrestarowałeś grę. Teraz animacji nie masz ;).")
        }
        document.getElementById(game.starships[key].position).setAttribute('fill', 'hotpink');
        if (gamePopupMovingShip.open && gamePopupMovingShip.name == key) {
          gamePopupShip.openPopup(key);
        }
      }
    }
  })
}


function updateAll(onClick: boolean, game: Game) {
  Object.keys(mapComSecond).forEach(key => {
    if (mapComSecond[key].open) {
      if (onClick) {
        mapComSecond[key].updateOnClick(game);
      } else {
        mapComSecond[key].updateSecond(game);
      }
    }
  });
  window.localStorage.removeItem("game");
  window.localStorage.setItem("game", JSON.stringify(game));
}

// Every 1 sec updateLeft everything
function oneSecUpdate(game: Game): void {
  timeUpdate(game);
  updateAll(false, game);
  // gameMain.addAnimation();//game.starships["Maja"], game.planets["Tleilax"], 9);
  setTimeout(oneSecUpdate, 1000, game);
}

function dzik(game: Game): void {
  console.log(JSON.stringify(game));
  gameTrick = game;
  console.log(game);

  gameMain.updateHeader(game);
  gameMain.updateLeft(game);
  gameMain.updateRight(game);
  gameMain.updateMap(game);
  // addAnimation();


  let elementsArray = document.querySelectorAll("circle");
  elementsArray.forEach(function (elem) {
    elem.addEventListener("click", function (ev: Event) {
      gamePopupPlanet.openPopup(elem.id);
      window.location.href = "#popup";
    });
  });

  updateAll(true, game);
  oneSecUpdate(game);
}

let localGameString = window.localStorage.getItem("game");
console.log(localGameString);
console.log(localGameString == null);
console.log(JSON.parse(localGameString));

if (localGameString == null) {
  fetch("/json/game.json")///home/rychh/Desktop/AW_GRA/
    .then(function (resp) {
      return resp.json();
    }).then(function (json) {
    window.localStorage.setItem("game", json);
    return json as Game;
  }).then(dzik);
} else {
  let localGame = JSON.parse(localGameString) as Game;
  dzik(localGame);
}


function goToIndex() {
  window.location.href = "index.html";
}


function addAnimation(ship: Ship, shipName: string, planet: Planet, time: number) {
  let svg = document.getElementById("svgMap");

  let element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  element.setAttribute("points", "0,-5 15,0 0,5");
  element.setAttribute("style", "fill:violet;stroke:darkviolet;stroke-width:1");
  element.id = shipName;

  let animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
  animation.setAttribute("path",
    "M" + 3 * ship.x + " " + 3 * ship.y + "  L" + 3 * planet.x + " " + 3 * planet.y);
  animation.setAttribute("begin", pageTime + "s");

  animation.setAttribute("dur", time + "s");
  animation.setAttribute("rotate", "auto");

  element.appendChild(animation);
  svg.appendChild(element);
}


function checkTheCorrectness(planetName: string, planet: Planet, shipName: string, ship: Ship, items: string[], balance: number[], base: number) {
  let newCap = 0;
  let money = 0;

  for (let i = 0; i < balance.length; i++) {
    let item = items[i];

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

  if (base + money < 0)
    throw new Error("You don't have enough money. You need " + money + " R more.");

  if (newCap > ship.cargo_hold_size)
    throw new Error(shipName + " don't have enough capacity.");
}

function changeValue(planet: Planet, ship: Ship, items: string[], balance: number[]): number {
  let money = 0;
  for (let i = 0; i < balance.length; i++) {
    let item = items[i];
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
  let balance: number[] = [];
  let money: number = 0;
  let correctActrion: boolean = gameTrick.game_run;
  let ship: Ship = gameTrick.starships[gamePopupShip.name];
  let planet: Planet = gameTrick.planets[ship.position];
  let x;
  for (let i = 0; i < gameTrick.items.length; i++) {
    // @ts-ignore
    x = Number(document.getElementById(gameTrick.items[i]).value);
    if (isNaN(x)) correctActrion = false;
    balance.push(x);
  }
  try {
    checkTheCorrectness(ship.position, planet, gamePopupShip.name, ship, gameTrick.items, balance, gameTrick.initial_credits);
    gameTrick.initial_credits += changeValue(planet, ship, gameTrick.items, balance);
    updateAll(true, gameTrick);

  } catch (e) {
    console.log(e);
  }
}

let tests = [];
let testNextId = 0;


class ItemPlanetClass implements ItemPlanet {
  available: number;
  buy_price: number;
  sell_price: number;

  constructor(available, buy_price, sell_price) {
    this.available = available;
    this.buy_price = buy_price;
    this.sell_price = sell_price;
  }
}

class PlanetClass implements Planet {
  x: number;
  y: number;
  available_items: { [key: string]: ItemPlanet } = {};

  constructor(item: string) {
    this.x = 0;
    this.y = 0;
    this.available_items[item] = new ItemPlanetClass(0, 0, 0);
  }
}

class ItemShipClass implements ItemShip {
  available: number;

  constructor(available: number) {
    this.available = available;
  }
}

class ShipClass implements Ship {
  x: number;
  y: number;
  timer: number;
  inTheSpace: boolean;
  position: string;
  cargo_hold_size: number;
  current_capacity: number;
  items: {
    [key: string]: ItemShip
  };

  constructor(item: string, position: string) {
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
}


abstract class LogicalTest {
  planetName: string;
  shipName: string;
  name: string;
  planet: Planet;
  ship: Ship;
  items: string[] = [];
  balance: number[] = [];
  id: number;

  protected constructor(name, item) {
    this.id = ++testNextId;
    tests[this.id] = this;
    this.name = name;
    this.planetName = "TestPlanet_" + this.id;
    this.shipName = "TestShip_" + this.id;
    this.items = [];
    this.items.push(item);
    this.planet = new PlanetClass(item);
    this.ship = new ShipClass(item, this.planetName);
    this.balance[0] = 0;
  }

  abstract test();

  start() {
    console.log("Start Test " + this.id + " " + this.name);
    try {
      this.test();
      console.log("Correct End Test " + this.id);
    } catch (e) {
      console.log("Upsik?!?! Coś poszło nie tak!")
      console.log(e);
      throw e;
    }
  }

  errorMessageShip(item: string): string {
    return this.shipName + " don't have enough " + item;
  }

  errorMessagePlanet(item: string): string {
    return this.planetName + " don't have enough " + item;
  }

  errorMessageMoney(money: number): string {
    return "You don't have enough money. You need " + money + " R more.";
  }

  errorMessageCap(): string {
    return this.shipName + " don't have enough capacity.";
  }
}

class TestBrakZiemniakow extends LogicalTest {
  constructor() {
    super("Brak Ziemniakow", "Ziemniak");
  }

  test() {
    let item = "Ziemniak";

    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
    } catch (e) {
      throw new Error("Pusty test" + e);
    }

    this.ship.cargo_hold_size = 1;
    this.balance[0] = 1;
    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
      throw new Error("Nie powinno być możliwości kupna");
    } catch (e) {
      if (this.errorMessagePlanet(item) != e.message) {
        throw new Error("Inny error1" + e);
      }
    }

    this.balance[0] = -1;

    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
      throw new Error("Nie powinno być możliwości sprzedaży");
    } catch (e) {
      if (this.errorMessageShip(item) != e.message) {
        console.log(this.errorMessageShip(item));
        console.log(e.message);
        throw new Error("Inny error2 " + e.message);
      }
    }

    this.ship.items[item].available = 1;
    this.ship.current_capacity = 1;
    this.planet.available_items[item].sell_price = 1;
    this.planet.available_items[item].available = 0;

    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
      if (changeValue(this.planet, this.ship, this.items, this.balance) != 1)
        throw new Error("Hajs sie nie zgadza");

      if (this.ship.items[item].available != 0)
        throw new Error("Ilość przedmiotów sie nie zgadza");

      if (this.ship.current_capacity != 0)
        throw new Error("Statek nie powinien nic miec");

      if (this.planet.available_items[item].available == 0)
        throw new Error("Na planecie powinno byc wiece itemow");

    } catch (e) {
      throw new Error("Problem z sprzedażą " + e);
    }
  }
}


class TestBrakHajsow extends LogicalTest {
  constructor() {
    super("Brak Pieniedzy", "Ziemniak");
  }

  test() {
    let item = "Ziemniak";

    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
    } catch (e) {
      throw new Error("Pusty test" + e);
    }

    this.balance[0] = 1;
    this.ship.cargo_hold_size = 1;
    this.planet.available_items[item].buy_price = 1;
    this.planet.available_items[item].available = 1;

    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
    } catch (e) {
      if (this.errorMessageMoney(-1) != e.message) {
        throw new Error("Inny error1" + e);
      }
    }

    this.balance[0] = -1;

    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 0);
    } catch (e) {
      if (this.errorMessageShip(item) != e.message) {
        console.log("Cs");
        throw new Error("Inny error2 " + e);
      }
    }

    this.ship.cargo_hold_size = 1;
    this.ship.current_capacity = 1;
    this.balance[0] = 1;
    this.planet.available_items[item].buy_price = 1;
    this.planet.available_items[item].available = 1;


    try {
      checkTheCorrectness(this.planetName, this.planet,
        this.shipName, this.ship, this.items, this.balance, 1);
    } catch (e) {
      if (this.errorMessageCap() != e.message) {
        console.log("Cs");
        throw new Error("Inny error3 " + e);
      }
    }
  }
}

let testZiemniak = new TestBrakZiemniakow();
let testBrakHajsu = new TestBrakHajsow();

function testowanko() {
  for (let i = 1; i <= testNextId; i++)
    tests[i].start();
}


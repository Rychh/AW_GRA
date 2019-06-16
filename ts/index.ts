function postData(url = '', data = {}) {
  // Default options are marked with *
  return fetch(url, {
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
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then(response => response.json()); // parses JSON response into native Javascript objects
}

async function saveNickname() {
  if (zalogowany) {
    // @ts-ignore
    let nickname: string = document.getElementById("nickname").value;
    let gameName = actualGameName;

    await postData('/database/state', {token: token, gameName: gameName})
      .then(data => {
        window.localStorage.removeItem("nickname");
        window.localStorage.setItem("nickname", nickname);
        window.localStorage.removeItem("game");
        window.localStorage.setItem("game", data["state"]);
        window.localStorage.removeItem("gameName");
        window.localStorage.setItem("gameName", gameName);
        window.location.href = "game.html";
      }) // JSON-string from `response.json()` call
      .catch(error => console.error(error));
  }
  /*
  -nie dziala!!!

  jak chcesz odczytac to robisz
  let nickname = window.localStorage.getItem("nickname");
  blablabla

  usuwasz, zeby potem ustawic tutaj znowu na nowo czyli
  window.localStorage.removeItem("nickname");

  -czym jest teraz "username"? Czy przy secie jest potrzebny?
  nie lol nie trzeba
  moze byc tak:
  window.localStorage.setItem("nickname", nickname);

  -Dobra działa dzięki :***

  -Ciekawostka: "button" w fromularzu zachowuje się czasami jak submit...

  -Kiedyś w podstawówce  wysyłaliśmy karteczki by komunikować się ze sobą.
  Na MIMie podajemy sobie laptopy.

   */
}

let gameNames;
let actualGameName = "";
let actualState = "";
let zalogowany = true;
let token = "";
let nick = "nick";
let password = "12346";

async function chooseMap() {
  let select = document.getElementById("select_map");
  // @ts-ignore
  let gameName = select.options[select.selectedIndex].value;
  actualGameName = gameName;
  //set description
  for (let i = 0; i < gameNames.length; i++) {
    if (gameNames[i]["gameName"] == gameName) {
      document.getElementById("map_description").innerHTML = gameNames[i]["description"];
    }
  }

  //set map_name
  document.getElementById("map_name").innerHTML = gameName;

  //set ranking
  let table = document.getElementById("tbody_score");
  let tbody = "";
  await postData('/database/scores', {gameName: gameName})
    .then(data => {
      data.sort(function (a, b) {
        return a["score"] < b["score"]
      });
      for (let i = 0; i < data.length && i < 5; i++) {
        tbody += '<tr>\n' +
          '<td>' + (i + 1) + '.</td>\n' +
          '<td>' + data[i]["nick"] + '</td>\n' +
          '<td>' + data[i]["score"] + '</td>\n' +
          '</tr>\n';
      }
      table.innerHTML = tbody;
    }) // JSON-string from `response.json()` call
    .catch(error => console.error(error));
  await postData('/database/state', {gameName: actualGameName})
    .then(data => {
      actualState = data["state"];
    }) // JSON-string from `response.json()` call
    .catch(error => console.error(error));
}

fetch('http://localhost:3112/database/gameNames')
  .then(function (response) {
    return response.json();
  })
  .then(async function (gameNamesFetch) {
    gameNames = gameNamesFetch;
    let options = "";
    if (gameNames.length > 0) {
      options = '<option value="' + gameNames[0]["gameName"] + '" selected="selected" onclick="chooseMap()">' + gameNames[0]["gameName"] + '</optionn>\n';
    } else {
      options = "Problem with server."
    }
    for (let i = 1; i < gameNames.length; i++) {
      options += '<option value="' + gameNames[i]["gameName"] + '" onclick="chooseMap()">' + gameNames[i]["gameName"] + '</option>\n';
    }
    document.getElementById("select_map").innerHTML = options;
    await chooseMap();
  });


async function copyToClipboard() {
  const el = document.createElement('textarea');
  // await postData('/database/state', {gameName: actualGameName})
  //   .then(data => {
  console.log(actualGameName + "Co?");
  el.value = actualState;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  // }) // JSON-string from `response.json()` call
  // .catch(error => console.error(error));
}

async function addMap() {
  // @ts-ignore
  let gameName = document.getElementById("add_map_game_name").value;
  // @ts-ignore
  let description = document.getElementById("add_map_description").value;
  // @ts-ignore
  let state = document.getElementById("add_map_state").value;
  postData('/database/addGame', {
    token: token,
    token_check: true,
    gameName: gameName,
    description: description,
    state: state
  }).then(data => {
    document.getElementById('add_map_info').innerText = data.message;
    console.log(data);
  });
}

function zaloguj() {
  postData('/login', {token: token, nick: nick, password: password}).then(data => {
    if (data.token) {
      token = data.token;
      window.localStorage.removeItem("token");
      window.localStorage.setItem("token", token);
      document.getElementById("add_map_button").style.display = "";
      document.getElementById("new_game_button").style.display = "";
      zalogowany = true;
    }
    console.log(data.message);
  });
}

function wyloguj() {
  window.localStorage.removeItem("token");
  token = "";
  document.getElementById("add_map_button").style.display = "none";
  document.getElementById("new_game_button").style.display = "none";
  console.log("wyloguj");
  zalogowany = false;
}

wyloguj();


// Facebook

// @ts-ignore

window.fbAsyncInit = function () {
  // @ts-ignore
  FB.init({
    appId: '', //TODO trzeba dodać adres
    cookie: true,
    xfbml: true,
    version: 'v3.3'
  });

  // @ts-ignore
  FB.AppEvents.logPageView();
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

document.getElementById('share-button').addEventListener('click', function () {
  // @ts-ignore
  FB.ui({
    method: 'share',
    href: window.location.href
  }, function (response) {
    if (!response) {
      console.log('User did not share the page.');
    } else {
      console.log('User shared the page!');
    }
  });
});

function checkLoginState() {
  zaloguj();
// @ts-ignore
  FB.getLoginStatus(function (response) {
// @ts-ignore
    statusChangeCallback(response);
  });
}

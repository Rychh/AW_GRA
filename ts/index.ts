function saveNickname() {
  // @ts-ignore
  let nickname: string = document.getElementById("nickname").value;
  window.localStorage.setItem("nickname", nickname);
  window.localStorage.removeItem("game");
  window.location.href = "game.html";

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

async function chooseMap() {
  // @ts-ignore
  let select = document.getElementById("select_map");
  // @ts-ignore
  let gameName = select.options[select.selectedIndex].value;

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

postData('/database/scores', {gameName: "My_life"})
  .then(data => console.log(data)) // JSON-string from `response.json()` call
  .catch(error => console.error(error));


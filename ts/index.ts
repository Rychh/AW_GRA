function saveNickname() {
  // @ts-ignore
  let nickname: string = document.getElementById("nickname").value;
  window.localStorage.setItem("nickname", nickname);
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

import {Builder, By, Key, until} from 'selenium-webdriver';
const firefox = require("selenium-webdriver/firefox");
import express = require('express');
import {Server} from 'http';
import {Express} from "express";
import * as path from "path";
import { expect } from "chai";
import "mocha";

import * as webdriver from "selenium-webdriver";
import { fail } from 'assert';

const LOCAL_URL = "http://localhost:1337";

let options = new firefox.Options()
  .addArguments("--marionette")
  .addArguments("--marionette-port")
  .addArguments("1337");

const driver = new Builder()
  .forBrowser('firefox').setFirefoxOptions(options).build();

function findById(elementClass): webdriver.WebElement {
  return driver.findElement({id: elementClass});
}

function findByClass(elementClass): webdriver.WebElement {
  return driver.findElement(webdriver.By.className(elementClass));
}

function findByHTMLTag(tag): webdriver.WebElement {
  return driver.findElement(webdriver.By.xpath(tag));
}

function findByText(text): webdriver.WebElement {
  return driver.findElement(webdriver.By.xpath("//*[contains(text()," + text + ")]"));
}

async function logIn(nickname): Promise<boolean> {
  try {
    await findById("button").click();
    await findById("nickname").clear();
    await findById("nickname").sendKeys("testowy nick");
    await findById("submitButton").click();
    return true;
  } catch (err) {
    //  console.log(err);
    return false;
  }
}


describe('Rozpoczęcie gry', () => {

  let app: Express;
  let server: Server;

  before( () => {
    app = express();
    console.log(__dirname);
    app.use(express.static(path.join(__dirname, '../../dist')));
    server = app.listen(5000, () => console.log("listening..."));
  });

  it('Nick sie prawidlowo wyswietla', async function () {
      this.timeout(20000);
      await driver.get(LOCAL_URL);

      await logIn("testowy nick");

      let nickDisplayed = await findById("nicknameHeader").getText();

      expect(nickDisplayed).to.equal("testowy nick");
  });

  it('Zaczynamy z 1 R', async function () {
      this.timeout(20000);
      await driver.get(LOCAL_URL);

      await logIn("testowy nick");

      let stanKonta = await findById("konto").getText();

      expect(stanKonta.toLowerCase()).is.equal("stan konta: 1 r");
  });

  it('Wybierz statek na planecie', async function () {
    this.timeout(20000);
    await driver.get(LOCAL_URL);

    await logIn("testowy nick");

    await driver.sleep(1000);

    await findById("Mars").click();

    await driver.sleep(200);

    await findById("MajaLink").click();

    await driver.sleep(200);

    let name = await driver.findElement(webdriver.By.xpath("//*/game.popup.header/h1")).getText();

    expect(name).is.equal("Maja");
  });

  after(async function () {
    this.timeout(20000);
    try {
      await driver.sleep(1000);
      await driver.quit();
      await server.close();
    } catch (err) {
      console.log(err);
    }
  });
});


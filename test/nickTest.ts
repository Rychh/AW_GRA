import {Builder, By, Key, until} from 'selenium-webdriver';
import express = require('express');
import {Server} from 'http';
import {Express} from "express";
import * as path from "path";
import { expect } from "chai";
import "mocha";

import * as webdriver from "selenium-webdriver";

const LOCAL_URL = "http://localhost:1337";

const driver = new Builder()
  .forBrowser('firefox').build();

function findById(elementClass): webdriver.WebElement {
  return driver.findElement({id: elementClass});
}

function findByHTMLTag(tag): webdriver.WebElement {
  return driver.findElement(webdriver.By.xpath(tag));
}


describe('DefaultTest', () => {

  let app: Express;
  let server: Server;

  before( () => {
    app = express();
    console.log(__dirname);
    app.use(express.static(path.join(__dirname, '../../dist')));
    server = app.listen(5000, () => console.log("listening..."));
  });

  it('Nick sie prawidlowo wyswietla', async function () {
    try {
      this.timeout(20000);
      await driver.get(LOCAL_URL);
      await findById("button").click();
      await findById("nickname").clear();
      await findById("nickname").sendKeys("testowy nick");
      await findById("submitButton").click();
      expect(findByHTMLTag("//*/game.main.header/h1").getText() == "testowy nick");
    } catch (error) {
      console.log(error);
    }
  });

  after(async () => {
    driver.quit();
    server.close();
  });
});

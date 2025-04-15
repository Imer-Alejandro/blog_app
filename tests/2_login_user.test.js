const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const assert = require('assert');
require('chromedriver');

describe('Inicio de sesión', function () {
  this.timeout(20000);

  let driver;

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería iniciar sesión con un usuario válido', async function () {
    const username = 'user_test';
    const password = 'test123_#23121%_Q';

    await driver.get('http://localhost:3000/register');
    await driver.wait(until.elementLocated(By.id('registerForm')), 5000);

    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#registerForm button[type="submit"]')).click();

    await driver.wait(until.alertIsPresent(), 5000);
    const registerAlert = await driver.switchTo().alert();
    console.log('Mensaje del alert:', await registerAlert.getText());
    await registerAlert.accept();

    await driver.wait(until.urlContains('/login'), 5000);
    await driver.get('http://localhost:3000/login');
    await driver.wait(until.elementLocated(By.id('loginForm')), 5000);

    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#loginForm button[type="submit"]')).click();

    
      await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      assert.strictEqual(currentUrl, 'http://localhost:3000/dashboard', 'No redirigió al home después del login');

    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync(`screenshots/home_login.png`, screenshot, 'base64');
      
  });
});

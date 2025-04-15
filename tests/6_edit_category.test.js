const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const assert = require('assert');
require('chromedriver');

describe('Editar categoría', function () {
  this.timeout(30000);
  let driver;
  const username = 'user_edit_test';
  const password = 'test123_Editar';
  const originalName = 'Categoría Original';
  const updatedName = 'Categoría Actualizada';

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .build();

    // Registro
    await driver.get('http://localhost:3000/register');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#registerForm button[type="submit"]')).click();

    try {
      await driver.wait(until.alertIsPresent(), 3000);
      await (await driver.switchTo().alert()).accept();
    } catch (_) {}

    // Login
    await driver.get('http://localhost:3000/login');
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);
    await driver.findElement(By.css('#loginForm button[type="submit"]')).click();

    await driver.wait(until.urlIs('http://localhost:3000/dashboard'), 5000);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('debería crear y luego editar una categoría existente', async function () {
    await driver.findElement(By.css('a[href="/categories"]')).click();
    await driver.wait(until.urlIs('http://localhost:3000/categories'), 5000);
    await driver.wait(until.elementLocated(By.id('categoryForm')), 5000);

    // Crear categoría
    const nameInput = await driver.findElement(By.id('categoryNameInput'));
    await nameInput.clear();
    await nameInput.sendKeys(originalName);
    await driver.findElement(By.css('#categoryForm button[type="submit"]')).click();

    await driver.sleep(1000);
    let categoryItems = await driver.findElements(By.css('#categoryList li'));
    assert.ok(categoryItems.length > 0, 'No se agregó ninguna categoría.');


    const editButton = await categoryItems[0].findElement(By.css('.btn-outline-primary'));
    await editButton.click();

    const input = await driver.findElement(By.id('categoryNameInput'));
    await driver.wait(async () => {
      const value = await input.getAttribute('value');
      return value === originalName;
    }, 3000);

    const beforeScreenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/before_edit_category.png', beforeScreenshot, 'base64');
    

    // Modificar nombre y guardar
    await input.clear();
    await input.sendKeys(updatedName);
    await driver.findElement(By.css('#categoryForm button[type="submit"]')).click();

    await driver.sleep(1000);

    // Captura después de editar
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshots/after_edit_category.png', screenshot, 'base64');

    const updatedItems = await driver.findElements(By.css('#categoryList li'));
    let updatedExists = false;
    for (let li of updatedItems) {
      const text = await li.getText();
      if (text.includes(updatedName)) {
        updatedExists = true;
        break;
      }
    }

    assert.strictEqual(updatedExists, true, `La categoría no fue actualizada correctamente a "${updatedName}".`);
  });
});
